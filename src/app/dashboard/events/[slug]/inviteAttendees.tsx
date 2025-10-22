"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import useModal from "@/hooks/useModal";
import type { EventDetails } from "@/types";

const InviteAttendees = ({ eventDetails }: { eventDetails: EventDetails }) => {
  const { open, close, Modal } = useModal();
  useEffect(() => {
    if (eventDetails.totalInvite === 0) {
      open();
    }
  }, [eventDetails.totalInvite, open]);
  return (
    <>
      <Button onClick={open} variant={"destructive"}>
        Invite Attendees
      </Button>
      <Modal>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">
            {eventDetails.totalInvite === 0
              ? "Get started by inviting at least one attendee"
              : "Invite Attendees"}{" "}
            to {eventDetails.title}
          </h2>
          <p className="mb-4">
            Feature to invite attendees will be implemented here.
          </p>
          <div className="flex justify-end">
            <Button onClick={close}>Close</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default InviteAttendees;
