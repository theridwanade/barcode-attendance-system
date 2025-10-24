import Events from '@/models/events.model';
import jwt from 'jsonwebtoken';
import type { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const { qrData } = body;
    const isValidQR = jwt.verify(qrData, process.env.JWT_SECRET!);
    if (!isValidQR) {
        return new Response("Invalid QR code", { status: 400 });
    }
    const event = await Events.findById(isValidQR.eventId);
    if (!event) {
        return new Response("Event not found", { status: 404 });
    }
    const invitedContact = event.invitedContacts.find(
        (c) => String(c.contact) === isValidQR.attendeeId,
    );
    if (!invitedContact) {
        return new Response("Invited contact not found", { status: 404 });
    }
    invitedContact.checkInTime = new Date();
    await event.save();
    return new Response("Attendance recorded", { status: 200 });
}