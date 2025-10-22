import { connectToDatabase } from "@/lib/connectdb";
import Events from "@/models/events.model";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { slug: string } },
) => {
  const { slug } = await params;

  const body = await req.json();
  const attendees = body.attendees.map((attendee: any) => attendee.id);
  console.log("Attendees to be invited:", attendees);
  await connectToDatabase();
  await Events.findOneAndUpdate(
    { _id: slug },
    {
      $push: {
        invitedContacts: { $each: attendees },
      },
    },
  );


  // Example response
  return NextResponse.json({
    message: `Invite sent for event ${slug}`,
  });
}
