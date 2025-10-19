import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EventCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={"/dashboard/events/1"} className="hover:underline">
          Devfest Ilorin 2025
          </Link>
          </CardTitle>
        <CardDescription>
          Date: {new Date().toLocaleDateString()}
        </CardDescription>
        <CardAction>
          <Button variant={"outline"} className={"cursor-pointer"}>
            Record Attendance
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
};
export default EventCard;
