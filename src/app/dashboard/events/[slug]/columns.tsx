"use client";
import type { ColumnDef } from "@tanstack/react-table";
// import { MoreHorizontal } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

export type Attendance = {
  id: string;
  name: string;
  email: string;
  checkInTime: string;
};

export const columns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "checkInTime",
    header: "Check-In Time",
  },
  //   {
  //     id: "actions",
  //     cell: ({ row }) => {
  //       const attendees = row.original;

  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <span className="sr-only">Open menu</span>
  //               <MoreHorizontal className="h-4 w-4" />
  //             </Button>
  //           </DropdownMenuTrigger>
  //         </DropdownMenu>
  //       );
  //     },
  //   },
];
