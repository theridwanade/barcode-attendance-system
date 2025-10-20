import { connectToDatabase } from "@/lib/connectdb";
import Admins from "@/models/admins.mode";
import { headers } from "next/headers";
import { Webhook } from "svix";

export const POST = async (req: Request) => {
    const payload = await req.text();
    const headerList = await headers();
    await connectToDatabase();

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    let event;
    
    try {
        event = webhook.verify(payload, {
            "svix-id": headerList.get("svix-id")!,
            "svix-timestamp": headerList.get("svix-timestamp")!,
            "svix-signature": headerList.get("svix-signature")!,
        });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Invalid signature", { status: 400 });
    }
    
    if(event!.type === "user.created") {
        const user = event!.data!;

        await Admins.create({
            email: user.email_addresses[0].email_address,
            username: user.username,
            clerkId: user.id,
        });
    }
    return new Response("Webhook received", { status: 200 });
}