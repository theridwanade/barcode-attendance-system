import {currentUser} from "@clerk/nextjs/server";
import {DataTable} from "@/app/app/dashboard/events/data-table";
import {columns, EventDetails} from "@/app/app/dashboard/events/columns";

async function getData(): Promise<EventDetails[]> {
    return [
        {
            id: "wsf23ewa",
            name: "Build with AI",
            date: "today",
            attendees: 5
        }
    ]
}
const DashBoardPage = async  () => {
    const user = await currentUser()
    const data = await getData()

    return <div className={"p-4"}>
        <div>
            <h1 className={"text-xl font-bold"}>Welcome to the Dashboard, {user ? user.firstName : "Guest"}</h1>
        </div>
        <div>
            <DataTable columns={columns} data={data} />
        </div>
    </div>;
}

export default DashBoardPage;