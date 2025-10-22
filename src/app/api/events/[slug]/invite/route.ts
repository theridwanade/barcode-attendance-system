import { connectToDatabase } from "@/lib/connectdb";
import Events from "@/models/events.model";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { slug: string } },
) => {
  const { slug } = await params;

  const body = await req.json();
  const attendees = body.attendees;
  await connectToDatabase();

  attendees.forEach(async (attendeeId: string) => {
    await Events.findOneAndUpdate(
      { _id: slug },
      { $push: { invitedContacts: { contact: attendeeId } } },
      { new: true },
    );
  });

  // Example response
  return NextResponse.json({
    message: `Invite sent for event ${slug}`,
  });
}
