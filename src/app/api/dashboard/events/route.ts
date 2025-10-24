// Route is: /api/dashboard/events

import { NextResponse } from "next/server";
import Events from "@/models/events.model";
import { connectToDatabase } from "@/lib/connectdb";
import { auth } from "@clerk/nextjs/server";
import Admins from "@/models/admins.model";

export const GET = async (req: Request) => {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectToDatabase();

  const admin = await Admins.findOne({ clerkId: userId });

  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }
  const eventsRecords = await Events.find({ admin: admin._id });
  const events = eventsRecords.map((event) => {
    return {
      id: event._id,
      title: event.title,
      description: event.description,
      date: event.date.start,
      location: `{ ${event.venue.name} - ${event.venue.address} }`,
      invitedContacts: event.invitedContacts,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  });
  return NextResponse.json(
    { message: "Events retrieved successfully", events },
    { status: 200 },
  );
};
