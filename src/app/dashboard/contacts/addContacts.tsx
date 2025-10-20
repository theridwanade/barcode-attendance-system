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

const AddContacts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Add Contacts</Button>

      {/* Modal overlay */}
      <div
        className={twMerge(
          "fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300",
          isModalOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={() => setIsModalOpen(false)}
      >
        {/* Modal content */}
        <Card className="p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <CardHeader className="flex justify-between items-center mb-4">
            <CardTitle>Add New Contact</CardTitle>
            <CardAction>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="ghost"
                size="icon"
              >
                <X />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-6">
              Modal content goes here...
            </p>
            <div className="flex justify-end"></div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsModalOpen(false)}>
              Save Contact
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default AddContacts;
