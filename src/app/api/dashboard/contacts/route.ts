// Route is : /api/dashboard/contacts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Contacts from "@/models/contacts.model";

export const GET = async () => {
  await connectToDatabase();

  const contacts = await Contacts.find();
  console.log(contacts);
  const contactData = contacts.map((contact, index) => {
    return {
      id: index + 1,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      dateAdded: contact.createdAt.toISOString().split("T")[0], // Format date as YYYY-MM-DD
    };
  });

  return NextResponse.json(contactData);
};
