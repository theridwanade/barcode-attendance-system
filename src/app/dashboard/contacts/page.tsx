import { SignedIn, UserButton } from "@clerk/nextjs";
import AddContacts from "./addContacts";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getContactsData = async () => {
  // Some i will fetch the data from here via api
  // TODO: implement data fetching
  return [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      dateAdded: "2024-01-01",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "987-654-3210",
      dateAdded: "2024-01-02",
    },
    {
      id: "3",
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "555-123-4567",
      dateAdded: "2024-01-03",
    },
    {
      id: "4",
      name: "Bob Brown",
      email: "bob@example.com",
      phone: "444-555-6666",
      dateAdded: "2024-01-04",
    },
  ];
};

const Page = async () => {
  const contactsData = await getContactsData();

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
          <AddContacts />
        </div>

        {/* div for the main body */}
        <div className="mt-4 mx-5">
          <DataTable columns={columns} data={contactsData} />
        </div>
      </main>
    </>
  );
};

export default Page;
