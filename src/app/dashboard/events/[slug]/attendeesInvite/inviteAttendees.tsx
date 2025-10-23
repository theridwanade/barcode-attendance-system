"use client";
import { X } from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useModal from "@/hooks/useModal";
import type { EventDetails } from "@/types/types";
import { getContactsData } from "../../actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useRouter } from "next/navigation";

const InviteAttendees = ({ eventDetails }: { eventDetails: EventDetails }) => {
  const { open, close, Modal } = useModal();
  const [error, setError] = useState({
    isError: false,
    message: "",
  });
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // biome-ignore lint/correctness/useExhaustiveDependencies: who knows
  const fetchContacts = useCallback(async () => {
    if (isLoading) return; // still checks it
    try {
      setIsLoading(true);
      setError({ isError: false, message: "" });

      const data = await getContactsData(eventDetails.invitedContacts || []);
      if (data.length === 0) {
        setError({
          isError: true,
          message:
            "No contacts found. You have already invited all your contacts.",
        });
        router.refresh();
        return;
      }

      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError({
        isError: true,
        message: "Failed to fetch contacts. Please try again.",
      });
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  }, [eventDetails._id, eventDetails.invitedContacts, isLoading]);

  useEffect(() => {
    if (eventDetails.invitedContacts?.length === 0) {
      open();
    }
  }, [eventDetails.invitedContacts, open]);
  const hasFetched = useRef(false);
  useEffect(() => {
    if (!hasFetched.current) {
      fetchContacts();
      hasFetched.current = true;
    }
  }, [fetchContacts]);

  const handleAttendeesInvite = async (selectedRows: typeof contacts) => {
    try {
      const attendeesId = selectedRows.map((attendee) => attendee.id);
      const response = await fetch(`/api/events/${eventDetails._id}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attendees: attendeesId }),
      });
      if (!response.ok) {
        setError({ isError: true, message: "Failed to invite attendees" });
        return;
      }

      await fetchContacts();
      router.refresh();
      close();
      await fetchContacts();
    } catch (error) {
      console.error("Error inviting attendees:", error);
    }
  };
  return (
    <>
      <Button
        onClick={() => {
          setError({ isError: false, message: "" });
          fetchContacts();
          open();
        }}
        variant={"destructive"}
      >
        Invite Attendees
      </Button>
      <Modal>
        <Card>
          <CardHeader>
            <div>
              <div className="flex flex-row justify-between items-center mb-4">
                <CardTitle className="text-lg font-semibold">
                  {eventDetails.invitedContacts?.length === 0
                    ? "Invite at least one attendee"
                    : "Invite Attendees"}{" "}
                  to {eventDetails.title}
                </CardTitle>
                <CardAction>
                  <Button onClick={close} variant={"ghost"}>
                    <X />
                  </Button>
                </CardAction>
              </div>
              <CardDescription>
                {eventDetails.invitedContacts?.length === 0
                  ? "You have not invited any attendees yet. Please invite at least one attendee to proceed."
                  : `You have invited ${eventDetails.invitedContacts?.length} attendees to this event.`}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {error.isError && (
              <p className="text-red-500 mb-4">{error.message}</p>
            )}
            <DataTable
              columns={columns}
              data={contacts}
              handleAttendeesInvite={handleAttendeesInvite}
            />
          </CardContent>
        </Card>
      </Modal>
    </>
  );
};
export default InviteAttendees;
