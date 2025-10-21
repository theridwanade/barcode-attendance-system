/** biome-ignore-all lint/a11y/noStaticElementInteractions: Cause i need that */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: Cause i need that too */
"use client";

import { X } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import useModal from "@/hooks/useModal";

const AddContacts = ({onAdded}: {onAdded: () => void}) => {
  const { open, close, Modal } = useModal();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {

      setLoading(true);
    const response = await fetch("/api/dashboard/contacts/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();


    
  } catch (err) {
    console.error("Failed to add contact:", err);
  } finally {
      onAdded();
      setLoading(false);
      close();
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    }
  };
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
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input
                      type="tel"
                      id="phone"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </Field>
                  <Field>
                    <Button type="submit" onClick={handleSubmit} disabled={loading}>
                      {loading ? <Spinner /> : "Save"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </div>
          </CardContent>
          <CardFooter>
            {/* <Button onClick={() => close()}>Save Contact</Button> */}
          </CardFooter>
        </Card>
      </Modal>
    </>
  );
};

export default AddContacts;
