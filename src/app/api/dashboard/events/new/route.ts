// Route is: /api/dashboard/events/new
import { connectToDatabase } from "@/lib/connectdb";
import Admins from "@/models/admins.model";
import Events from "@/models/events.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export const POST = async (req: Request)  => {
    const body = await req.json();
    const {title, description, date, location } = body;
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

      const newEvent = await Events.create({
        title,
        description,
        date,
        location
      })

    return NextResponse.json({ message: "Event created successfully", id: newEvent._id }, { status: 201 });
}