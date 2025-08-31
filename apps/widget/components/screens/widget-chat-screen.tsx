"use client";

import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "@/atoms/widget-atoms";
import { useAtomValue, useSetAtom } from "jotai";

import React from "react";
import WidgetHeader from "../widget-header";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";

function WidgetChatScreen() {
  const setScreen = useSetAtom(screenAtom)
  const setConversation = useSetAtom(conversationIdAtom)
  
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );
  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          contactSessionId: contactSessionId,
          conversationId: conversationId,
        }
      : "skip"
  );
  const onBack = ()=> {
    setConversation(null)
    setScreen('selection')
  }
  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Button size={"icon"} variant={"transparent"} onClick={onBack}>
            <ArrowLeftIcon />
          </Button>
          <p>Chat</p>
        </div>
        <Button size={"icon"} variant={"transparent"}>
          <MenuIcon />
        </Button>
      </WidgetHeader>
      <div className="flex flex-1  gap-y-4 p-4 flex-col ">
        {JSON.stringify(conversation)}
      </div>
    </>
  );
}

export default WidgetChatScreen;
