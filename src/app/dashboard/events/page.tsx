import { Button } from "@/components/ui/button";
import { SignedIn,UserButton } from "@clerk/nextjs";
import EventCard from "./eventCard";

const Page = () => {
  return (
    <>
      <header className="flex justify-between items-center p-4 gap-4 h-16">
        <h1 className="text-xl font-bold">Events</h1>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main className="p-4">
        <div className="flex justify-end">
          <Button>Create Event</Button>
        </div>
        <div className="p-5 grid gap-5">
            {
             Array.from({length: 2}).map((_, index) => (
                <EventCard key={index} />
             ))
            }
        </div>
      </main>
    </>
  );
}
export default Page