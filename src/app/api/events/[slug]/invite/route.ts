import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Events from "@/models/events.model";
import { PassClassEventTicketType, PassObjectEventTicketType } from "@/types/passTypes";
import { createClass, createObject, generateSaveLink } from "@/lib/googlePass";

export const POST = async (
  req: NextRequest,
  { params }: { params: { slug: string } },
) => {
  const { slug } = await params;

  const body = await req.json();
  const attendees = body.attendees;
  await connectToDatabase();
  const event = await Events.findOne({ _id: slug })
    .populate("admin")
    .populate({
      path: "invitedContacts.contact",
      select: "name email phone",
    })
    .lean();

  const invitations = await sendInvitations(event, attendees);
  console.log(invitations);
  attendees.forEach(async (attendeeId: string) => {
    await Events.findOneAndUpdate(
      { _id: slug },
      { $push: { invitedContacts: { contact: attendeeId } } },
      { new: true },
    );
  });

  return NextResponse.json({
    message: `Invite sent for event ${slug}`,
  });
};


const sendInvitations = async (event: any, attendees: string[]) => {
  const issuerId = String(process.env.GOOGLE_PASS_ISSUER_ID);

  const passClassData: PassClassEventTicketType = {
    id: `${issuerId}.${event._id}_event_ticket_v1.0.4`,
    issuerName: event.admin.username || event.admin.name || "Event Organizer",
    reviewStatus: "UNDER_REVIEW",
    eventName: {
      defaultValue: {
        language: "en-US",
        value: event.title,
      },
    },
    venue: {
      name: {
        defaultValue: {
          language: "en-US",
          value: event.venue?.name || "Venue not specified",
        },
      },
      address: {
        defaultValue: {
          language: "en-US",
          value: event.venue?.address || "",
        },
      },
    },
    dateTime: {
      start: event.date?.start?.toISOString(),
      end: event.date?.end?.toISOString(),
    },
    hexBackgroundColor: "#4285F4",
    multipleDevicesAndHoldersAllowedStatus: "ONE_USER_ALL_DEVICES",
  };

  const classId = await createClass(passClassData);

  const saveUrls = await Promise.all(
    attendees.map(async (attendeeId, index) => {
      const contactData = event.invitedContacts.find(
        (c: any) => String(c.contact._id) === attendeeId
      )?.contact;

      const passObjectData: PassObjectEventTicketType = {
        id: `${issuerId}.${event._id}_${attendeeId}_event_ticket_object_${index + 1}`,
        classId,
        state: "ACTIVE",
        barcode: {
          type: "QR_CODE",
          value: `EVENT_${event._id}_ATTENDEE_${attendeeId}`,
        },
        cardTitle: {
          defaultValue: {
            language: "en-US",
            value: `Ticket for ${event.title}`,
          },
        },
        ticketHolderName: contactData?.name || "Attendee",
      };

      await createObject(classId, passObjectData);

      return generateSaveLink(passObjectData);
    })
  );

  return saveUrls;
};
