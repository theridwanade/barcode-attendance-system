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
        <CardTitle>Devfest Ilorin 2025</CardTitle>
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
