import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import { generateSaveLink } from "@/lib/googlePass";
import Contacts from "@/models/contacts.model"; // ✅ Add this
import Events from "@/models/events.model";
import type { PassObjectEventTicketType } from "@/types/passTypes";

export const GET = async (
  req: NextRequest,
  { params }: { params: { eventId: string } },
) => {
  const { eventId } = await params;
  const attendeeId = req.nextUrl.searchParams.get("attendee")!;

  await connectToDatabase();

  const event = await Events.findById(eventId)
    .populate("invitedContacts.contact")
    .lean();

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const contactData = event.invitedContacts.find(
    (c: any) => String(c.contact._id) === attendeeId,
  );

  const classId = event.eventPassClassId!;
  const objectId = contactData?.eventPassObjectId!;
  const ticketToken = jwt.sign(
    {
      attendeeId: contactData?.contact._id,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" },
  );

  const passObjectData: PassObjectEventTicketType = {
    id: objectId,
    classId: classId,
    state: "ACTIVE",
    barcode: {
      type: "QR_CODE",
      value: ticketToken,
    },
    ticketHolderName: contactData?.contact.name,
  };

  const saveLink = await generateSaveLink(passObjectData);
  return NextResponse.redirect(saveLink);
};
