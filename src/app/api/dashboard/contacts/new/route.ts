// Route is : /api/dashboard/contacts/new

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectdb";
import Contacts from "@/models/contacts.model";
import { auth } from "@clerk/nextjs/server";
import Admins from "@/models/admins.mode";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { name, email, phone } = body;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectToDatabase();

  const admin = await Admins.findOne({ clerkId: userId });

  if (!admin) {
    return NextResponse.json(
      { error: "Admin not found" },
      { status: 404 },
    );
  }


  await Contacts.findOneAndUpdate(
    { admin: admin._id },
    {
      $push: {
        contacts: { name, email, phone }
      }
    },
    {
      new: true,
      upsert: true,
    }
  )

  return NextResponse.json({
    success: true,
  });
};
