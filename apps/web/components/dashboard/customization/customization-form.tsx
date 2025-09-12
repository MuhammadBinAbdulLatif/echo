import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";
import z from "zod";
import { Doc } from "@workspace/backend/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { VapiFormFields } from "../plugins/vapi/vapi-form-fields";
// TODO: First create the widget settings upsert function before that.
type Props = {
  initialData?: WidgetSettings | null;
  hasVapiPlugin: boolean;
};

// Combined schema for all Widget settings
export const widgetSettingsSchema = z.object({
  greetMessage: z.string().min(1, "Greeting message is required"),
  defaultSuggestions: z.object({
    suggestion1: z.string().optional(),
    suggestion2: z.string().optional(),
    suggestion3: z.string().optional(),
  }),
  vapiSettings: z.object({
    assistantId: z.string().optional(),
    phoneNumber: z.string().optional(),
  }),
});
type WidgetSettings = Doc<"widgetSettings">;
const CustomizationForm = ({ initialData, hasVapiPlugin }: Props) => {
  const upsertWidgetSettings = useMutation(api.private.widgetSettings.upsert);
  const form = useForm<z.infer<typeof widgetSettingsSchema>>({
    resolver: zodResolver(widgetSettingsSchema),
    defaultValues: {
      greetMessage:
        initialData?.greetMessage || "Hi! How can i help you today?",
      defaultSuggestions: {
        suggestion1: initialData?.defalutSuggestions.suggestion1,
        suggestion2: initialData?.defalutSuggestions.suggestion2,
        suggestion3: initialData?.defalutSuggestions.suggestion3,
      },
      vapiSettings: {
        assistantId: initialData?.vapiSettings.assistantId || "",
        phoneNumber: initialData?.vapiSettings.phoneNumber || "",
      },
    },
  });
  const onSubmit = async (values: z.infer<typeof widgetSettingsSchema>) => {
    try {
      const vapiSettings: WidgetSettings["vapiSettings"] = {
        assistantId:
          values.vapiSettings.assistantId === "none"
            ? ""
            : values.vapiSettings.assistantId,
        phoneNumber:
          values.vapiSettings.phoneNumber === "none"
            ? ""
            : values.vapiSettings.phoneNumber,
      };
      await upsertWidgetSettings({
        greetMessage: values.greetMessage,
        defalutSuggestions: values.defaultSuggestions,
        vapiSettings,
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>General Chat Settings</CardTitle>
            <CardDescription>
              Configure basic chat widget and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="greetMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Greeting Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Welcome message shown when chat is open"
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    The first message the customer sees when he / she opens the
                    chat
                  </FormDescription>
                </FormItem>
              )}
            />
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="">
                <h3 className="mb-4 text-sm">Default Suggestion</h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  Quick reply suggestions shown to customers to help guide the
                  conversation
                </p>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 1</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="How do i get started ? "
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 2</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="What are your pricing plans"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultSuggestions.suggestion3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggestion 3</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="I need help with my account"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {hasVapiPlugin && (
          <Card>
            <CardHeader>
              <CardTitle>Voice Assistant Settings</CardTitle>
              <CardDescription>
                Configure the call settings powered by vapi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <VapiFormFields form={form} />
            </CardContent>
          </Card>
        )}
        <div className="flex justify-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save Settings
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default CustomizationForm;
