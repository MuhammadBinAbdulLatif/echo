"use client";
import React from "react";
import WidgetHeader from "../widget-header";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  organizationIdAtom,
  screenAtom,
} from "@/atoms/widget-atoms";

const WidgetOnboardScreen = () => {
  const setScreen = useSetAtom(screenAtom)
  // ✅ Add validation rules
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
  });

  const createContactSession = useMutation(api.public.contactSessions.create);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  const organizationId = useAtomValue(organizationIdAtom);
  const setContactSessionId = useSetAtom(
      contactSessionIdAtomFamily(organizationId || "")
    );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    

    if (!organizationId) return;

    const metadata: Doc<"contactSessions">["metadata"] = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages?.join(","),
      platform: navigator.platform,
      vendor: navigator.vendor,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewPortSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      referrer: document.referrer || "direct",
      currentUrl: window.location.href,
    };
    
    const contactSessionId = await createContactSession({
      ...values,
      organizationId,
      metadata,
    });
    setContactSessionId(contactSessionId);
    setScreen('selection')

  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there 🤚</p>
          <p className="text-lg">Let's get you started!</p>
        </div>
      </WidgetHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onReset={onReset}
          className="space-y-8 @container"
        >
          <div className="flex flex-col py-2 px-2 gap-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 items-start">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      key="name"
                      placeholder="John Doe"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 items-start">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      key="email"
                      placeholder="johndoe@gmail.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Button with loader */}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="size-8 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default WidgetOnboardScreen;
