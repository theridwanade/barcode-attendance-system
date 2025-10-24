import Events from "@/models/events.model";
import jwt from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { slug: string } },
) => {
  const body = await req.json();
  const { qrData } = body;
  const { slug } = await params;
  const isValidQR = jwt.verify(qrData, process.env.JWT_SECRET!);
  if (!isValidQR) {
    return NextResponse.json({ error: "Invalid QR data" }, { status: 400 });
  }
  const event = await Events.findById(slug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  const invitedContact = event.invitedContacts.find(
    (c) => String(c.contact) === isValidQR.attendeeId,
  );
  if (!invitedContact) {
    return new Response("Invited contact not found", { status: 404 });
  }
  if (invitedContact.checkInTime) {
    return NextResponse.json(
      { error: "Attendance already recorded" },
      { status: 400 },
    );
  }
  invitedContact.checkInTime = new Date();
  await event.save();
  return NextResponse.json({ message: "Attendance recorded" }, { status: 200 });
};
