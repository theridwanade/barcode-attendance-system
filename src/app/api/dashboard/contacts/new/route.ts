// Route is : /api/dashboard/contacts/new

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Contacts from "@/models/contacts.model";
import { auth } from "@clerk/nextjs/server";
import Admins from "@/models/admins.model";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { name, email, phone } = body;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const admin = await Admins.findOne({ clerkId: userId });

  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  await Contacts.create({
    admin: admin._id,
    name,
    email,
    phone,
  });

  return NextResponse.json({
    success: true,
  });
};
