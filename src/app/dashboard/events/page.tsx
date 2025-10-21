"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import EventCard from "./eventCard";
import useModal from "@/hooks/useModal";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDownIcon, X } from "lucide-react";
import { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const Page = () => {
  interface FormDataType {
    title: string;
    description: string;
    date: Date | undefined;
    location: string;
  }
  const { open, close, Modal } = useModal();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    date: undefined,
    location: "",
  });
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Form Data Submitted:", formData);
    } catch (err) {
      console.error("Failed to create event:", err);
    } finally {
      setLoading(false);
      close();
      setFormData({
        title: "",
        description: "",
        date: undefined,
        location: "",
      });
    }
  }
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
          <Button onClick={open}>Create Event</Button>
          <Modal>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Create New Event</CardTitle>
                <CardAction>
                  <Button onClick={() => close()} variant="ghost" size="icon">
                    <X />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                {/* Event creation form goes here */}
                <div>
                  <form>
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="title">Event Title</FieldLabel>
                        <Input
                          id="title"
                          placeholder="Enter event title"
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="description">
                          Description
                        </FieldLabel>
                        <Input
                          id="description"
                          placeholder="Enter event description"
                          type="text"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <FieldGroup className="flex gap-4">
                        <Field>
                          <FieldLabel htmlFor="date-picker">Date</FieldLabel>
                          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="date-picker"
                                className="w-32 justify-between font-normal"
                              >
                                {formData.date ? formData.date.toLocaleDateString() : "Select date"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={formData.date}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                  setFormData({ ...formData, date });
                                  setDatePickerOpen(false);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="time-picker">Time</FieldLabel>
                          <Input
                            type="time"
                            id="time-picker"
                            step="1"
                            defaultValue="10:30:00"
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          />
                        </Field>
                      </FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="location">Location</FieldLabel>
                        <Input
                          id="location"
                          placeholder="Enter event location"
                          type="text"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <Button
                          type="submit"
                          onClick={handleSubmit}
                          disabled={loading}
                        >
                          {loading ? <Spinner /> : "Save"}
                        </Button>
                      </Field>
                    </FieldGroup>
                  </form>
                </div>
              </CardContent>
            </Card>
          </Modal>
        </div>
        <div className="p-5 grid gap-5">
          {Array.from({ length: 2 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: i don't know the fuck happening here, might figure it out later.
            <EventCard key={index} />
          ))}
        </div>
      </main>
    </>
  );
};
export default Page;
