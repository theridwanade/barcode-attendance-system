"use server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/connectdb";
import Admins from "@/models/admins.model";
import Contacts from "@/models/contacts.model";

export const getContactsData = async () => {
  await connectToDatabase();
  const { userId } = await auth();

  const admin = await Admins.findOne({ clerkId: userId });
  if (!admin) return [];

  const contactsRecords = await Contacts.findOne({ admin: admin._id }).lean();
  const contacts = contactsRecords?.contacts ?? [];

  interface Contacts {
    _id?: string;
    name: string;
    email: string;
    phone: string;
  }

  const formattedContacts = contacts.map(
    (contact: Contacts) => ({
      id: contact._id?.toString(),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    }),
  );
  return formattedContacts;
};
