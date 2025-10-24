import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Events from "@/models/events.model";
import Contacts from "@/models/contacts.model"; // assuming you have this model
import type { PassClassEventTicketType } from "@/types/passTypes";
import { createClass } from "@/lib/googlePass";
import { sendInvitationEmail } from "@/lib/sendMail";

export const POST = async (
  req: NextRequest,
  { params }: { params: { slug: string } },
) => {
  try {
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

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Create event class ID if not already created
    let classId = event.eventPassClassId;
    if (!classId) {
      classId = await generatePassClassId(event);
      await Events.findByIdAndUpdate(slug, { eventPassClassId: classId });
    }

    for (const attendeeId of attendees) {
      let contactData =
        event.invitedContacts.find(
          (c: any) => String(c.contact._id) === attendeeId,
        )?.contact ?? null;

      // If not found inside event.invitedContacts, fetch from Contacts
      if (!contactData) {
        contactData = await Contacts.findById(attendeeId)
          .select("name email phone")
          .lean();
      }

      if (!contactData || !contactData.email) {
        console.warn(`⚠️ Skipping attendee ${attendeeId}: missing email`);
        continue;
      }

      const subject = `🎫 You're invited to ${event.title}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:auto; padding: 20px;">
          <h2>Hi ${contactData.name || "there"},</h2>
          <p>You have been invited to <strong>${event.title}</strong>.</p>
          <p><strong>Date:</strong> ${new Date(event.date.start).toLocaleString()}</p>
          <p><strong>Venue:</strong> ${event.venue.name}, ${event.venue.address}</p>
          <p style="margin-top: 20px;">Click below to view your invitation:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/invite/${slug}?attendee=${attendeeId}"
            style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;">View Invitation</a>
        </div>
      `;

      await sendInvitationEmail(contactData.email, subject, "", html);

      await Events.findByIdAndUpdate(slug, {
        $push: {
          invitedContacts: {
            contact: attendeeId,
            eventPassObjectId: `${classId}_${attendeeId}`,
          },
        },
      });
    }

    return NextResponse.json({
      message: `Invitations sent successfully for ${event.title}`,
    });
  } catch (error: any) {
    console.error("Error sending invitations:", error);
    return NextResponse.json(
      { error: "Failed to send invitations", details: error.message },
      { status: 500 },
    );
  }
};

const generatePassClassId = async (event: any) => {
  const issuerId = String(process.env.GOOGLE_PASS_ISSUER_ID);

  const passClassData: PassClassEventTicketType = {
    id: `${issuerId}.${event._id}_event_ticket_v1.0.4`,
    issuerName: event.admin.username || event.admin.name || "Event Organizer",
    reviewStatus: "UNDER_REVIEW",
    eventName: {
      defaultValue: { language: "en-US", value: event.title },
    },
    venue: {
      name: {
        defaultValue: {
          language: "en-US",
          value: event.venue?.name || "Venue not specified",
        },
      },
      address: {
        defaultValue: { language: "en-US", value: event.venue?.address || "" },
      },
    },
    dateTime: {
      start: event.date?.start?.toISOString(),
      end: event.date?.end?.toISOString(),
    },
    hexBackgroundColor: "#4285F4",
    multipleDevicesAndHoldersAllowedStatus: "ONE_USER_ALL_DEVICES",
  };

  return await createClass(passClassData);
};

// const sendInvitations = async (event: any, attendees: string[]) => {
//   const issuerId = String(process.env.GOOGLE_PASS_ISSUER_ID);

//   const passClassData: PassClassEventTicketType = {
//     id: `${issuerId}.${event._id}_event_ticket_v1.0.4`,
//     issuerName: event.admin.username || event.admin.name || "Event Organizer",
//     reviewStatus: "UNDER_REVIEW",
//     eventName: {
//       defaultValue: {
//         language: "en-US",
//         value: event.title,
//       },
//     },
//     venue: {
//       name: {
//         defaultValue: {
//           language: "en-US",
//           value: event.venue?.name || "Venue not specified",
//         },
//       },
//       address: {
//         defaultValue: {
//           language: "en-US",
//           value: event.venue?.address || "",
//         },
//       },
//     },
//     dateTime: {
//       start: event.date?.start?.toISOString(),
//       end: event.date?.end?.toISOString(),
//     },
//     hexBackgroundColor: "#4285F4",
//     multipleDevicesAndHoldersAllowedStatus: "ONE_USER_ALL_DEVICES",
//   };

//   const classId = await createClass(passClassData);

//   const saveUrls = await Promise.all(
//     attendees.map(async (attendeeId, index) => {
//       const contactData = event.invitedContacts.find(
//         (c: any) => String(c.contact._id) === attendeeId
//       )?.contact;

//       const passObjectData: PassObjectEventTicketType = {
//         id: `${issuerId}.${event._id}_${attendeeId}_event_ticket_object_${index + 1}`,
//         classId,
//         state: "ACTIVE",
//         barcode: {
//           type: "QR_CODE",
//           value: `EVENT_${event._id}_ATTENDEE_${attendeeId}`,
//         },
//         cardTitle: {
//           defaultValue: {
//             language: "en-US",
//             value: `Ticket for ${event.title}`,
//           },
//         },
//         ticketHolderName: contactData?.name || "Attendee",
//       };

//       await createObject(classId, passObjectData);

//       return generateSaveLink(passObjectData);
//     })
//   );

//   return saveUrls;
// };
