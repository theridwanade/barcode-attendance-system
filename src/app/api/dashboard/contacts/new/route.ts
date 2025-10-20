// Route is : /api/dashboard/contacts/new

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Contacts from "@/models/contacts.model";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { name, email, phone } = body;

  await connectToDatabase();

  await Contacts.create({ name, email, phone });

  return NextResponse.json({
    success: true,
  });
};
