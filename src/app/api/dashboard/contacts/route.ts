import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Contacts from "@/models/contacts.model";
import { auth } from "@clerk/nextjs/server";
import Admins from "@/models/admins.model";

interface Contact {
  name: string;
  email: string;
  phone: string;
  createdAt?: Date | null;
}

export const GET = async () => {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const admin = await Admins.findOne({ clerkId: userId });
  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const record = await Contacts.findOne({ admin: admin._id });
  if (!record) {
    return NextResponse.json([], { status: 200 });
  }

  const contacts = record.contacts || [];

  const contactData = contacts.map((contact: Contact, index: number) => ({
    id: index + 1,
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    dateAdded: contact.createdAt
      ? contact.createdAt.toISOString().split("T")[0]
      : "Unknown",
  }));

  return NextResponse.json(contactData);
};
