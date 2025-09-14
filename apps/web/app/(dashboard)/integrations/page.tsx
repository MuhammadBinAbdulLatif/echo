"use client";
import { useOrganization } from "@clerk/nextjs";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Separator } from "@workspace/ui/components/separator";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { createScript } from "./utils";

const INTEGRATIONS = [
  {
    id: "html",
    title: "HTML",
    icon: "/languages/html5.svg",
  },
  {
    id: "react",
    title: "React",
    icon: "/languages/react.svg",
  },
  {
    id: "nextjs",
    title: "Next.js",
    icon: "/languages/nextjs.svg",
  },
  {
    id: "javascript",
    title: "Javascript",
    icon: "/languages/javascript.svg",
  },
];
type IntegrationId = (typeof INTEGRATIONS)[number]["id"];

function page() {
  const [openDialog, setOpenDialog] = useState(false);
  const { organization } = useOrganization();
  const [selectedSnippet, setSelectedSnippet] = useState("");
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(organization?.id ?? "");
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to add to clipboard");
    }
  };
  const handleIntegrationClick = (integrationId: IntegrationId) => {
    if (!organization) {
      toast.error("Loading organization ID");
      return;
    }
    const snippet = createScript(integrationId, organization.id) as string;
    setSelectedSnippet(snippet);
    setOpenDialog(true);
  };
  return (
    <>
      <IntegrationDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        snippet={selectedSnippet}
      />
      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-[100vh]">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Setup and Integrations</h1>
            <p className="text-muted-foreground">
              Choose the integration that is right for you
            </p>
          </div>
          <div className="mt-8 space-y-6">
            <div className="flex items-center gap-4">
              <Label className="w-34" htmlFor="website-id">
                Organizaiton ID
              </Label>
              <Input
                disabled
                id="organizationId"
                readOnly
                value={organization?.id ?? ""}
                className="flex-1 bg-background font-mono text-sm"
              />
              <Button className="gap-2" onClick={handleCopy} size={"sm"}>
                <CopyIcon className="size-4" />
                Copy
              </Button>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="space-y-6">
            <div className="space-y-1">
              <Label className="text-lg">Integrations</Label>
              <p className="text-muted-foreground">
                Add the following code to your website to start chatting
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {INTEGRATIONS.map((integration) => (
                <button
                  className="flex items-center gap-4 rounded-lg border bg-background hover:bg-accent p-4"
                  key={integration.id}
                  type="button"
                  onClick={() => {
                    handleIntegrationClick(integration.id);
                  }}
                >
                  <Image
                    alt={integration.title}
                    height={32}
                    src={integration.icon}
                    width={32}
                  />
                  <p>{integration.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;

export const IntegrationDialog = ({
  onOpenChange,
  open,
  snippet,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  snippet: string;
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to add to clipboard");
    }
  };
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Integrate with your website</DialogTitle>
          <DialogDescription>
            Follow these steps to add teh chatbox to your website
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="rounded-md bg-accent p-2 text-sm">
              1. Copy the following code
            </div>
            <div className="group relative">
              <pre className="max-h-[300px] overflow-x-auto overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-foreground p-2 font-mono text-secondary text-sm">
                {snippet}
              </pre>
              <Button
                className="absolute top-4 right-6 size-6 opacity-0 transition-opacity group-hover:opacity-10"
                size={"icon"}
                variant={"secondary"}
                onClick={handleCopy}
              >
                <CopyIcon className="size-3" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="rounded-md bg-accent p-2 text-sm">
                2. Add the code in your page
              </div>
              <p className="text-muted-foreground text-sm">
                Paste the chatbox code about in your page. You can add in the
                HTML head section{" "}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
