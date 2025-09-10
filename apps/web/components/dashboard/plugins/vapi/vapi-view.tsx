"use client";

import {
  GlobeIcon,
  PhoneCallIcon,
  PhoneIcon,
  WorkflowIcon,
} from "lucide-react";
import {
  Feature,
  PluginCard,
} from "@/components/dashboard/plugins/plugin-card";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useState } from "react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@workspace/ui/components/button";
import VapiConnectedView from "./vapi-connected-view";
const vapiFeatures: Feature[] = [
  {
    icon: GlobeIcon,
    label: "Web voice calls",
    description: "Voice chat directly in your app",
  },
  {
    icon: PhoneIcon,
    label: "Phone numbers",
    description: "Get dedicated business lines",
  },
  {
    icon: PhoneCallIcon,
    label: "Outbound calls",
    description: "Automated customer outreach",
  },
  {
    icon: WorkflowIcon,
    label: "Workflows",
    description: "Custom conversation flows",
  },
];
const formSchema = z.object({
  publicApiKey: z.string(),
  privateApiKey: z.string(),
});
const VapiPluginForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const upsertSecret = useMutation(api.private.secrets.upsert);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      privateApiKey: "",
      publicApiKey: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await upsertSecret({
        service: "vapi",
        value: {
          publicApiKey: values.publicApiKey,
          privateApiKey: values.privateApiKey,
        },
      });
      setOpen(false);
      toast.success("Vapi secret created");
    } catch (error) {
      console.error(error);
      toast.error("Somethign went wrong");
    }
  };
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Vapi</DialogTitle>
          <DialogDescription>
            Your api keys are safely encyrpted and secured in AWS Secrets
            Manager
          </DialogDescription>
          <Form {...form}>
            <form
              className="flex flex-col gap-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="publicApiKey"
                render={({ field }) => (
                  <FormItem>
                    <Label>Public API Key</Label>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your public API key"
                        type="password"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="privateApiKey"
                render={({ field }) => (
                  <FormItem>
                    <Label>Private API Key</Label>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your Private API key"
                        type="password"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? "Connecting" : "Connect"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
const VapiPluginRemoveForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const removePlugin = useMutation(api.private.plugins.remove);
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      privateApiKey: "",
      publicApiKey: "",
    },
  });
  const onSubmit = async () => {
    try {
      await removePlugin({
        service: "vapi",
      });
      setOpen(false);
      toast.success("Vapi disconnected successfully");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disconnect vapi</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove VAPI
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onSubmit} variant={"destructive"}>
            Disconnect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export const VapiView = () => {
  const [connectOpen, setConnectOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const toggleConnection = () => {
    if (vapiPlugin) {
      setRemoveOpen(true);
    } else {
      setConnectOpen(true);
    }
  };

  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });
  return (
    <>
      <VapiPluginForm open={connectOpen} setOpen={setConnectOpen} />
      <VapiPluginRemoveForm open={removeOpen} setOpen={setRemoveOpen} />
      <div className="flex min-h-screen flex-col bg-muted p-8">
        <div className="mx-auto w-full max-w-[100vh]">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl">Vapi Plugin</h1>
            <p className="text-muted-foreground">
              Connect vapi to enable AI voice calls and phone support
            </p>
          </div>
          <div className="mt-8">
            {vapiPlugin ? (
              <VapiConnectedView onDisconnect={toggleConnection} />
            ) : (
              <PluginCard
                serviceImage="/vapi.jpg"
                serviceName="vapi"
                features={vapiFeatures}
                isDisable={vapiPlugin === undefined}
                onSubmit={toggleConnection}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
