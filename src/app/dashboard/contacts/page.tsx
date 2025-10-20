import { SignedIn, UserButton } from "@clerk/nextjs";
import AddContacts from "./addContacts";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getContactsData = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/dashboard/contacts`);

  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    console.error("Failed to fetch contacts data");
  }
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
