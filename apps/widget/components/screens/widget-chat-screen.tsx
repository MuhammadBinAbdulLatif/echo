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
import {useThreadMessages, toUIMessages} from '@convex-dev/agent/react'
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import {AIConversation,AIConversationContent, AIConversationScrollButton  } from '@workspace/ui/components/ai/conversation'
import { AIInputTools, AIInput, AIInputSubmit, AIInputTextarea, AIInputToolbar } from "@workspace/ui/components/ai/input";
import { AIMessage, } from "@workspace/ui/components/ai/message";
import { AISuggestion, AISuggestions } from "@workspace/ui/components/ai/suggestion";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod"
import { useForm } from "react-hook-form";


const formSchema = z.object({
  message: z.string().min(2,{message: "Message must be at least 2 characters long"}).nonempty(),
})

function WidgetChatScreen() {
  const setScreen = useSetAtom(screenAtom)
  const setConversation = useSetAtom(conversationIdAtom)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ""
    }
  })
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

  const createMessage = useAction(api.public.message.create)

  const messages = useThreadMessages(api.public.message.getMany, conversation?.threadId && contactSessionId ? {
    threadId: conversation.threadId,
    contactSessionId: contactSessionId
  } : "skip", {
    initialNumItems: 10
  })

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
        {JSON.stringify(messages)}
      </div>
    </>
  );
}

export default WidgetChatScreen;
