// Route is : /api/dashboard/contacts

import { NextResponse } from "next/server"

export const GET = async () => {
    return NextResponse.json([
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
    {
        id: "5",
        name: "Charlie Davis",
        email: "charlie@example.com",
        phone: "333-444-5555",
        dateAdded: "2024-01-05",
    }
  ])
}
