import { UseFormReturn } from "react-hook-form";
import z from "zod";
import { widgetSettingsSchema } from "../../customization/customization-form";
import { useVapiAssistants, useVapiPhoneNumbers } from "@/hooks/use-vapi-data";
import {
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@workspace/ui/components/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@workspace/ui/components/form";
import { Textarea } from "@workspace/ui/components/textarea";
interface VapiFomrFieldsProps {
  form: UseFormReturn<z.infer<typeof widgetSettingsSchema>>;
}

export const VapiFormFields = ({ form }: VapiFomrFieldsProps) => {
  const disabled = form.formState.isSubmitting;
  const { data: assistants, isLoading: assistantsLoading } =
    useVapiAssistants();
  const { data: phoneNumbers, isLoading: phoneNumbersLoading } =
    useVapiPhoneNumbers();

  return (
    <>
      <FormField
        control={form.control}
        name="vapiSettings.assistantId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice Assistant</FormLabel>
            <Select
              disabled={assistantsLoading || disabled}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      assistantsLoading
                        ? "Loading Assistants"
                        : "Select an assistant"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none"></SelectItem>
                {assistants?.map((assistant) => (
                  <SelectItem key={assistant.id} value={assistant.id}>
                    {assistant.name || "Unnamed Assistant"}
                    {assistant.model?.model || "Unknown model"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Vapi assistant to use for the calls
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="vapiSettings.phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Numbers</FormLabel>
            <Select
              disabled={phoneNumbersLoading || disabled}
              onValueChange={field.onChange}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      assistantsLoading
                        ? "Loading phone numbers"
                        : "Select a phone number"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none"></SelectItem>
                {phoneNumbers?.map((number) => (
                  <SelectItem key={number.id} value={number.number}>
                    {number.number || "Not recieved number"}{" "}
                    {number.name || "Unnamed"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Vapi assistant to use for the calls
            </FormDescription>
          </FormItem>
        )}
      />
    </>
  );
};
