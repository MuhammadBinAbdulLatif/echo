import { useAction } from "convex/react";

import { api } from "@workspace/backend/convex/_generated/api";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { PhoneNumber } from "@clerk/nextjs/server";

type phoneNumbers = typeof api.private.vapi.getPhoneNumbers._returnType;
export const useVapiPhoneNumbers = (): {
  data: phoneNumbers | null;
  isLoading: boolean;
  error: Error | null;
} => {
  const [data, setData] = useState<phoneNumbers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumbers);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getPhoneNumbers();
        setData(result);
        setError(null);
      } catch (error) {
        setError(error as Error);
        toast.error("Failed to fetch phone numbers");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getPhoneNumbers]);
  return {
    data,
    isLoading,
    error,
  };
};

type Assistants = typeof api.private.vapi.getAssistants._returnType;
export const useVapiAssistants = (): {
  data: Assistants | null;
  isLoading: boolean;
  error: Error | null;
} => {
  const [data, setData] = useState<Assistants | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const getAssistants = useAction(api.private.vapi.getAssistants);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getAssistants();
        setData(result);
        setError(null);
      } catch (error) {
        setError(error as Error);
        toast.error("Failed to fetch asssistants");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getAssistants]);
  return {
    data,
    isLoading,
    error,
  };
};
