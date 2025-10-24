import { SignedIn, UserButton } from "@clerk/nextjs";
import { Button, buttonVariants } from "@/components/ui/button";
import { connectToDatabase } from "@/lib/connectdb";
import Events from "@/models/events.model";
import type { EventDetails } from "@/types/types";
import InviteAttendees from "./attendeesInvite/inviteAttendees";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import Link from "next/link";

interface RouteParams {
  params: {
    slug: string;
  };
}
const getEventDetails = async (slug: string): Promise<EventDetails> => {
  await connectToDatabase();
  const event = await Events.findById(slug).populate({
    path: "invitedContacts.contact",
    select: "name email phone",
  });

  return {
    _id: event?._id.toString(),
    title: event?.title,
    description: event?.description,
    startDate: event?.date.start.toISOString().split("T")[0],
    endDate: event?.date.end.toISOString().split("T")[0],
    venue: {
      name: event?.venue.name,
      address: event?.venue.address,
    },
    invitedContacts: event.invitedContacts.map((ic) =>
      ic.contact._id.toString(),
    ),
  };
};

const getAttendeesData = async (slug: string) => {
  await connectToDatabase();

  const event = await Events.findById(slug)
    .populate({
      path: "invitedContacts.contact",
      select: "name email phone",
    })
    .lean();

  if (!event) return [];

  const contacts = event.invitedContacts
    .map((ic) => {
      if (!ic.contact) return null; // skip invalid references
      return {
        id: ic.contact._id.toString(),
        name: ic.contact.name,
        email: ic.contact.email,
        checkInTime: ic.checkInTime
          ? new Date(ic.checkInTime).toLocaleString()
          : "Not Checked In",
      };
    })
    .filter(Boolean);

  return contacts;
};

const Page = async ({ params }: RouteParams) => {
  const { slug } = await params;
  const event = await getEventDetails(slug);
  // console.log("Event Details:", event);
  const attendanceData = await getAttendeesData(slug);
  return (
    <>
      <header className="flex justify-between items-center p-4 gap-4 h-16">
        <h1 className="text-xl font-bold">Events</h1>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main className="p-4">
        <div className="space-y-2">
          <h2 className="font-bold text-3xl">{event.title}</h2>
          <p className="text-lg">Description: {event.description}</p>
          <p className="text-lg">Start Date: {event.startDate}</p>
          <p className="text-lg">End Date: {event.endDate}</p>
          <p className="text-lg">
            Venue: {event.venue?.name} - {event.venue?.address}
          </p>
          <p className="text-lg">
            Total Invite: {event.invitedContacts?.length ?? 0}
          </p>
          <div className="flex gap-4 mt-4">
            <Link
              href={`/events/${event._id}/record-attendance`}
              className={buttonVariants({ variant: "default" })}
            >
              Register Attendance
            </Link>
            <InviteAttendees eventDetails={event} />
          </div>
        </div>
        {/* Data table for attendance */}
        <div className="mt-8 p-4">
          <DataTable columns={columns} data={attendanceData} />
        </div>
      </main>
    </>
  );
};
export default Page;
