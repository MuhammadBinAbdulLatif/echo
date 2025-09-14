"use client";
import React from "react";
import { useQuery } from "convex/react";
import { Button } from "@workspace/ui/components/button";
import { api } from "@workspace/backend/convex/_generated/api";

function DashboardPage() {
  const users = useQuery(api.users.getManyUsers);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">User Management Dashboard</h1>
      <div className="bg-background rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        {users && users.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user._id} className="hover:bg-muted">
                  <td className="py-2 px-4 border-b">{user.name || "-"}</td>
                  <td className="py-2 px-4 border-b">{user.email || "-"}</td>
                  <td className="py-2 px-4 border-b">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-muted-foreground">No users found.</div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
