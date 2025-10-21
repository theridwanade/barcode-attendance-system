// Route is: /api/dashboard/events

import { NextResponse } from "next/server";
import Events from "@/models/events.model";

export const GET = async (req: Request) => {
  const eventsRecords = await Events.find();
  const events = eventsRecords.map((event) => {
    return {
      id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      invitedContacts: event.invitedContacts,
      attendees: event.attendees,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  });
  return NextResponse.json(
    { message: "Events retrieved successfully", events },
    { status: 200 },
  );
};
