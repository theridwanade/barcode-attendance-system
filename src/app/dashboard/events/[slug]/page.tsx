import { SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getEventDetails = async (slug: string) => {
  return {
    title: "Sample Event",
    description: "This is a sample event description.",
    date: "2023-10-01",
    eventCreatedAt: "2023-09-01",
    location: "Sample Location",
    totalInvite: 100,
    attendees: 50,
  };
};

const getAttendanceData = async (slug: string) => {
  return [
    {
      id: "1",
      name: "John Doe",
      emailOrNumber: "john.doe@example.com",
      checkInTime: "2023-10-01T10:00:00Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      emailOrNumber: "123-456-7890",
      checkInTime: "2023-10-01T10:05:00Z",
    },
  ];
};

const Page = async () => {
  const event = await getEventDetails("slug");
  const attendanceData = await getAttendanceData("slug");
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
          <p className="text-lg">Event Date: {event.date}</p>
          <p className="text-lg">Event Created At: {event.eventCreatedAt}</p>
          <p className="text-lg">Location: {event.location}</p>
          <p className="text-lg">Attendees: {event.attendees}</p>
          <p className="text-lg">Total Invite: {event.totalInvite}</p>
          <div className="flex gap-4 mt-4">
            <Button>Register Attendance</Button>
            <Button>Assign an Admin</Button>
            <Button>Invite Attendees</Button>
            <Button variant={"destructive"}>Generate Report</Button>
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
