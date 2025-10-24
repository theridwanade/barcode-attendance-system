import { SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getAdminsData = async () => {
  // Some i will fetch the data from here via api
  // TODO: implement data fetching
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
    },
    {
      id: "3",
      name: "Alice Johnson",
      email: "alice@example.com",
    },
    {
      id: "4",
      name: "Bob Brown",
      email: "bob@example.com",
    },
  ];
};

const Page = async () => {
  const adminsData = await getAdminsData();
  return (
    <>
      <header className="flex justify-between items-center p-4 gap-4 h-16">
        <h1 className="text-xl font-bold">Contacts</h1>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <main className="p-4">
        <div className="flex justify-end">
          <Button>Add an Admin</Button>
        </div>

        {/* div for the main body */}
        <div className="mt-4 mx-5">
          <DataTable columns={columns} data={adminsData} />
        </div>
      </main>
    </>
  );
};
export default Page;
