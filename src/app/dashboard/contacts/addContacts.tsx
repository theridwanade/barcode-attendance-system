/** biome-ignore-all lint/a11y/noStaticElementInteractions: Cause i need that */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Cause i need that too */
"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useModal from "@/hooks/useModal";
import { Separator } from "@/components/ui/separator";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const AddContacts = () => {
  const { open, close, Modal } = useModal();

  return (
    <>
      <Button onClick={() => open()}>Add Contacts</Button>

      {/* Modal overlay */}
      <Modal>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Add New Contact</CardTitle>
            <CardAction>
              <Button onClick={() => close()} variant="ghost" size="icon">
                <X />
              </Button>
            </CardAction>
          </CardHeader>
          <Separator />
          <CardContent>
            <div>
              <form>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input id="name" placeholder="Enter full name" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input
                      type="tel"
                      id="phone"
                      placeholder="Enter phone number"
                    />
                  </Field>
                  <Field>
                    <Button type="submit">Save</Button>
                  </Field>
                </FieldGroup>
              </form>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => close()}>Save Contact</Button>
          </CardFooter>
        </Card>
      </Modal>
    </>
  );
};

export default AddContacts;
