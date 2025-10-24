"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import AddContacts from "./addContacts";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const Page = () => {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/contacts");
      const data = await res.json();
      console.log("Fetched Contacts:", data);
      setContacts(data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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
          <AddContacts onAdded={fetchContacts} />
        </div>

        {/* div for the main body */}
        <div className="mt-4 mx-5">
          <DataTable columns={columns} data={contacts} />
        </div>
      </main>
    </>
  );
};

export default Page;
