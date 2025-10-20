// Route is : /api/dashboard/contacts/new

import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const body = await req.json();
    const { name, email, phone } = body;

    console.log({name, email, phone})
    return NextResponse.json({
        success: true,
    });
} 