import { connectToDatabase } from "@/lib/connectdb";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { slug: string } },
) => {
  const { slug } = params;

  const body = await req.json();
  await connectToDatabase();

  

  // Example response
  return NextResponse.json({
    message: `Invite sent for event ${slug}`,
  });
}
