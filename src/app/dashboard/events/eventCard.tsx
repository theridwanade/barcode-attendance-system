import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

const EventCard = ({
  id,
  title,
  date,
}: EventCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/dashboard/events/${id}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
        <CardDescription>
          Date: {new Date(date).toLocaleDateString()}
        </CardDescription>
        <CardAction>
          <Link href={`/events/${id}/record-attendance`} className={buttonVariants({ variant: "outline" })}>
            Register Attendance
          </Link>
        </CardAction>
      </CardHeader>
    </Card>
  );
};
export default EventCard;
