"use client";

import React from "react";
import { useVapiPhoneNumbers } from "@/hooks/use-vapi-data";
import { DropdownMenu } from "@workspace/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { toast } from "sonner";
import { CheckCircleIcon, PhoneIcon, XCircle } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";

function VapiPhoneNumbers() {
  const { data: phoneNumbers, isLoading } = useVapiPhoneNumbers();
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };
  return (
    <div className="border-t bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-4">Phone Number</TableHead>
            <TableHead className="px-6 py-4">Name</TableHead>
            <TableHead className="px-6 py-4">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (isLoading) {
              return (
                <TableRow>
                  <TableCell
                    className=" px-6 py-8 text-center text-muted-foreground"
                    colSpan={4}
                  >
                    Loading Phone Number
                  </TableCell>
                </TableRow>
              );
            }

            if (!phoneNumbers || phoneNumbers.length === 0) {
              return (
                <TableRow>
                  <TableCell
                    className=" px-6 py-8 text-center text-muted-foreground"
                    colSpan={4}
                  >
                    No phone Numbers found
                  </TableCell>
                </TableRow>
              );
            }
            return phoneNumbers.map((phone) => (
              <TableRow className="hover:bg-muted/50" key={phone.id}>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="size-4 text-muted-foreground" />
                    <span className="font-mono">
                      {phone.number || "Not configured"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="size-4 text-muted-foreground" />
                    <span className="font-mono">{phone.name || "Unnamed"}</span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Badge
                    className="capitalize"
                    variant={
                      phone.status === "active" ? "default" : "destructive"
                    }
                  >
                    {phone.status === "active" && (
                      <CheckCircleIcon className="mr-1 size-3" />
                    )}
                    {phone.status !== "active" && (
                      <XCircle className="mr-1 size-3" />
                    )}
                    {phone.status || "unknown"}
                  </Badge>
                </TableCell>
              </TableRow>
            ));
          })()}
        </TableBody>
      </Table>
    </div>
  );
}

export default VapiPhoneNumbers;
