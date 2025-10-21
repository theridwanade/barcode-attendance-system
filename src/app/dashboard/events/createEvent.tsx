/** biome-ignore-all lint/a11y/noStaticElementInteractions: Cause i need that */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Cause i need that too */
"use client";

import { ChevronDownIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card, CardAction, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import {
    Field, FieldGroup, FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import useModal from "@/hooks/useModal";

const CreateEvents = ({ onAdded }: { onAdded: () => void }) => {
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
      const response = await fetch("/api/dashboard/events/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (err) {
      console.error("Failed to create event:", err);
    } finally {
      onAdded();
      setLoading(false);
      close();
      setFormData({
        title: "",
        description: "",
        date: undefined,
        location: "",
      });
    }
  };
  return (
    <>
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
                    <FieldLabel htmlFor="description">Description</FieldLabel>
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
                      <Popover
                        open={datePickerOpen}
                        onOpenChange={setDatePickerOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="date-picker"
                            className="w-32 justify-between font-normal"
                          >
                            {formData.date
                              ? formData.date.toLocaleDateString()
                              : "Select date"}
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="start"
                        >
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
    </>
  );
};
export default CreateEvents;
