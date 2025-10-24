"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import CreateEvents from "./createEvent";
import EventCard, { type EventCardProps } from "./eventCard";

const Page = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/events");
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  return (
    <>
      <header className="flex justify-between items-center p-4 gap-4 h-16">
        <h1 className="text-xl font-bold">Events</h1>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main className="p-4">
        <div className="flex justify-end">
          <CreateEvents onAdded={fetchEvents} />
        </div>
        <div className="p-5 grid gap-5">
          {events.length === 0 ? (
            <div className={"text-center items-center my-5"}>
              No events found
            </div>
          ) : (
            events.map((event: EventCardProps, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: i don't know the fuck happening here, might figure it out later.
              <EventCard key={index} {...event} />
            ))
          )}
        </div>
      </main>
    </>
  );
};
export default Page;
