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
        <p className="text-sm text-gray-600 mb-6">
          Modal content goes here...
        </p>
        <div className="flex justify-end"></div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => close()}>
          Save Contact
        </Button>
      </CardFooter>
    </Card>
   </Modal>
    </>
  );
};

export default AddContacts;
