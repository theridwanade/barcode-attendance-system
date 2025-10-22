"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useModal from "@/hooks/useModal";
import type { EventDetails } from "@/types";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const InviteAttendees = ({ eventDetails }: { eventDetails: EventDetails }) => {
  const { open, close, Modal } = useModal();
  const [error, setError] = useState({
    isError: false,
    message: "",
  });
  useEffect(() => {
    if (eventDetails.totalInvite === 0) {
      open();
    }
  }, [eventDetails.totalInvite, open]);
  const tempData = [
    { id: "1", name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210" }
  ];
  const handleAttendeesInvite = async (selectedRows: typeof tempData) => {
    try {
      console.log("Inviting attendees:", selectedRows);
      const response = await fetch(`/api/events/${eventDetails._id}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attendees: selectedRows }),
      });
      if (!response.ok) {
        setError({ isError: true, message: "Failed to invite attendees" });
        return;
      }

      close();
    } catch (error) {
      console.error("Error inviting attendees:", error);
    }
  }
  return (
    <>
      <Button onClick={() => {
        setError({isError: false, message: ""})
        open(); 
        }} variant={"destructive"}>
        Invite Attendees
      </Button>
      <Modal>
        <Card>
          <CardHeader>
            <div>
            <div className="flex flex-row justify-between items-center mb-4">
              <CardTitle className="text-lg font-semibold">{eventDetails.totalInvite === 0 ? "Invite at least one attendee" : "Invite Attendees"} to {eventDetails.title}</CardTitle>
              <CardAction>
                <Button onClick={close} variant={"ghost"}>
                  <X />
                </Button>
            </CardAction>
            </div>
            <CardDescription>
              {eventDetails.totalInvite === 0 ? "You have not invited any attendees yet. Please invite at least one attendee to proceed." : `You have invited ${eventDetails.totalInvite} attendees to this event.`}
            </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {error.isError && (<p className="text-red-500 mb-4">{error.message}</p>
            )}
            <DataTable columns={columns} data={tempData} handleAttendeesInvite={handleAttendeesInvite}/>
          </CardContent>
          </Card>
      </Modal>
    </>
  );
};
export default InviteAttendees;
