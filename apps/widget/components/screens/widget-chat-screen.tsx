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
import { AIMessage, AIMessageContent } from "@workspace/ui/components/ai/message";
import { AISuggestion, AISuggestions } from "@workspace/ui/components/ai/suggestion";
import { zodResolver } from "@hookform/resolvers/zod";
import {z} from "zod"
import { useForm } from "react-hook-form";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Form, FormField } from "@workspace/ui/components/form";

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
  const onSubmit  = async(values: z.infer<typeof formSchema>)=> {
    if(!conversation || !contactSessionId){
      return;
    }
    form.reset({
      message: ''
    })
    await createMessage({
      threadId:  conversation.threadId,
      prompt:values.message,
      contactSessionId
    })
   

  }

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
     <AIConversation>
      <AIConversationContent>
        {toUIMessages(messages.results ?? [])?.map((message)=> {
          return (
            <AIMessage from={message.role === 'user' ? 'user': 'assistant'}
            key={message.id}>
              <AIMessageContent>
                <AIResponse>
                  {message.text}
                </AIResponse>
              </AIMessageContent>
              {/* TODO: Create custom avatar component */}
            </AIMessage>
          )
        })}
      </AIConversationContent>
     </AIConversation>
     {/* TODO: Add suggestions */}
     <Form {...form}>

    <AIInput className="rounded-none border-x-0 border-b-0" onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <AIInputTextarea
          {...field}
            disabled={conversation?.status === "resolved"}
            onChange={field.onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }
            }}
            placeholder={
              conversation?.status === "resolved"
                ? "This conversation has been resolved"
                : "Type your message here..."
            }
          />
        )}
      />
      <AIInputToolbar>
        <AIInputToolbar />
        <AIInputSubmit disabled={conversation?.status === "resolved" || !form.formState.isValid || form.formState.isSubmitting} />
      </AIInputToolbar>
    </AIInput>
</Form>

    </>
  );
}

export default WidgetChatScreen;
