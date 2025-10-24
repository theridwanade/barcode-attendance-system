/** biome-ignore-all lint/a11y/noStaticElementInteractions: Cause i need that */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Cause i need that too */
"use client";

import { ChevronDownIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
    date: {
      start: Date | undefined;
      end: Date | undefined;
    };
    venue: {
      name: string;
      address: string;
    };
  }

  const { isOpen, open, close, Modal } = useModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ hasError: false, message: "" });
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    date: { start: undefined, end: undefined },
    venue: { name: "", address: "" },
  });

  const [datePickerOpen, setDatePickerOpen] = useState<"start" | "end" | null>(
    null
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (
        !formData.date.start ||
        !formData.date.end ||
        !formData.title ||
        !formData.venue.name ||
        !formData.venue.address
      ) {
        setError({ hasError: true, message: "All fields are required" });
        setLoading(false);
        return;
      } else setError({ hasError: false, message: "" });
      console.log("Submitting form data:", formData);
      const response = await fetch("/api/dashboard/events/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setFormData({
        title: "",
        description: "",
        date: { start: undefined, end: undefined },
        venue: { name: "", address: "" },
      });
      setLoading(false);
      router.push(`/dashboard/events/${data.id}`);
      close();
    } catch (err) {
      console.error("Failed to create event:", err);
    } finally {
      onAdded();
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          open();
          if (!isOpen) {
            setError({ hasError: false, message: "" });
            setLoading(false);
          }
        }}
      >
        Create Event
      </Button>
      <Modal>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Create New Event</CardTitle>
            <CardAction>
              <Button onClick={close} variant="ghost" size="icon">
                <X />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="title">Event Title</FieldLabel>
                  <Input
                    id="title"
                    placeholder="Enter event title"
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
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </Field>

                {/* --- Start Date --- */}
                <FieldGroup className="flex gap-4">
                  <Field>
                    <FieldLabel htmlFor="start-date">Start Date</FieldLabel>
                    <Popover
                      open={datePickerOpen === "start"}
                      onOpenChange={(open) =>
                        setDatePickerOpen(open ? "start" : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="start-date"
                          className="w-40 justify-between font-normal"
                        >
                          {formData.date.start
                            ? formData.date.start.toLocaleDateString()
                            : "Select start date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date.start}
                          onSelect={(date) => {
                            setFormData({
                              ...formData,
                              date: { ...formData.date, start: date },
                            });
                            setDatePickerOpen(null);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="start-time">Start Time</FieldLabel>
                    <Input
                      id="start-time"
                      type="time"
                      step="60"
                      onChange={(e) => {
                        if (!formData.date.start) return;
                        const [h, m] = e.target.value.split(":");
                        const newDate = new Date(formData.date.start);
                        newDate.setHours(Number(h));
                        newDate.setMinutes(Number(m));
                        setFormData({
                          ...formData,
                          date: { ...formData.date, start: newDate },
                        });
                      }}
                    />
                  </Field>
                </FieldGroup>

                {/* --- End Date --- */}
                <FieldGroup className="flex gap-4">
                  <Field>
                    <FieldLabel htmlFor="end-date">End Date</FieldLabel>
                    <Popover
                      open={datePickerOpen === "end"}
                      onOpenChange={(open) =>
                        setDatePickerOpen(open ? "end" : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="end-date"
                          className="w-40 justify-between font-normal"
                        >
                          {formData.date.end
                            ? formData.date.end.toLocaleDateString()
                            : "Select end date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date.end}
                          onSelect={(date) => {
                            setFormData({
                              ...formData,
                              date: { ...formData.date, end: date },
                            });
                            setDatePickerOpen(null);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="end-time">End Time</FieldLabel>
                    <Input
                      id="end-time"
                      type="time"
                      step="60"
                      onChange={(e) => {
                        if (!formData.date.end) return;
                        const [h, m] = e.target.value.split(":");
                        const newDate = new Date(formData.date.end);
                        newDate.setHours(Number(h));
                        newDate.setMinutes(Number(m));
                        setFormData({
                          ...formData,
                          date: { ...formData.date, end: newDate },
                        });
                      }}
                    />
                  </Field>
                </FieldGroup>

                {/* --- Venue --- */}
                <Field>
                  <FieldLabel htmlFor="venueName">Venue Name</FieldLabel>
                  <Input
                    id="venueName"
                    placeholder="Enter event venue name"
                    value={formData.venue.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venue: {
                          ...formData.venue,
                          name: e.target.value,
                        },
                      })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="venueAddress">Venue Address</FieldLabel>
                  <Input
                    id="venueAddress"
                    placeholder="Enter event address"
                    value={formData.venue.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        venue: {
                          ...formData.venue,
                          address: e.target.value,
                        },
                      })
                    }
                  />
                </Field>

                {error.hasError && (
                  <p className="text-red-500">{error.message}</p>
                )}

                <Field>
                  <Button type="submit" disabled={loading}>
                    {loading ? <Spinner /> : "Save"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </Modal>
    </>
  );
};

export default CreateEvents;
