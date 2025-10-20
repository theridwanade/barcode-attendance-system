// Route is : /api/dashboard/contacts/new

import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const body = await req.json();
    const { name, email, phone } = body;

    return NextResponse.json({
      message: "New contact addition proposed!",
      data: { name, email, phone },
    });
} 