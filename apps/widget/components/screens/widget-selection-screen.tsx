"use client";

import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  hasVapiSecretsAtom,
  organizationIdAtom,
  screenAtom,
  widgetSettingsAtom,
} from "@/atoms/widget-atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import React, { useState } from "react";
import WidgetHeader from "../widget-header";
import {
  ChevronRightIcon,
  MessageSquareTextIcon,
  MicIcon,
  PhoneIcon,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import WidgetFooter from "../widget-footer";

function WidgetSelectionScreen() {
  const [isPending, setIsPending] = useState(false);
  const setScreen = useSetAtom(screenAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const createConversation = useMutation(api.public.conversations.create);
  const handleNewConversation = async () => {
    setIsPending(true);
    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Missing organization ID");
      return;
    }
    if (!contactSessionId) {
      setScreen("auth");
      return;
    }
    try {
      const conversationId = await createConversation({
        organizationId,
        contactSessionId,
      });
      setConversationId(conversationId);
      setScreen("chat");
    } catch (error) {
      console.error(error);
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  };
  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there 🤚</p>
          <p className="text-lg">Let's get you started!</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1  gap-y-4 p-4 flex-col overflow-y-auto ">
        <Button
          disabled={isPending}
          className="h-16 w-full justify-between"
          variant={"outline"}
          onClick={handleNewConversation}
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareTextIcon className="size-4" />
            <span>Start Chat</span>
          </div>

          <ChevronRightIcon className="size-4" />
        </Button>
        {hasVapiSecrets && widgetSettings?.vapiSettings.assistantId && (
          <Button
            disabled={isPending}
            className="h-16 w-full justify-between"
            variant={"outline"}
            onClick={() => setScreen("voice")}
          >
            <div className="flex items-center gap-x-2">
              <MicIcon className="size-4" />
              <span>Start Voice call</span>
            </div>

            <ChevronRightIcon className="size-4" />
          </Button>
        )}
        {hasVapiSecrets && widgetSettings?.vapiSettings.phoneNumber && (
          <Button
            disabled={isPending}
            className="h-16 w-full justify-between"
            variant={"outline"}
            onClick={() => setScreen("contact")}
          >
            <div className="flex items-center gap-x-2">
              <PhoneIcon className="size-4" />
              <span>Call us</span>
            </div>

            <ChevronRightIcon className="size-4" />
          </Button>
        )}
      </div>
      <WidgetFooter />
    </>
  );
}

export default WidgetSelectionScreen;
