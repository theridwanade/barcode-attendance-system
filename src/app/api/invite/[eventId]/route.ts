import { connectToDatabase } from "@/lib/connectdb";
import Events from "@/models/events.model";
import Contacts from "@/models/contacts.model"; // ✅ Add this
import { NextRequest, NextResponse } from "next/server";
import { PassObjectEventTicketType } from "@/types/passTypes";
import { generateSaveLink } from "@/lib/googlePass";

export const GET = async (req: NextRequest, { params }: { params: { eventId: string } }) => {
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
        (c: any) => String(c.contact._id) === attendeeId
    )


    let classId = event.eventPassClassId!;
    let objectId = contactData?.eventPassObjectId!;

    let passObjectData: PassObjectEventTicketType = {
        id: objectId,
        classId: classId,
        state: "ACTIVE",
        barcode: {
            type: "QR_CODE",
            value: objectId, // add jwt verification later
        },
        ticketHolderName: contactData?.contact.name,
    }

    const saveLink = await generateSaveLink(passObjectData);
    return NextResponse.redirect(saveLink);
};
