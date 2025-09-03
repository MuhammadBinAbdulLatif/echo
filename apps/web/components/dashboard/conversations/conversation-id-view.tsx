"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { Form, FormField } from "@workspace/ui/components/form";
import {toUIMessages, useThreadMessages} from '@convex-dev/agent/react'
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInputTools,
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputButton,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { DiceBearAvatar } from "@workspace/ui/components/dicebear-avatar";
type Props = {
  conversationId: Id<"conversations">;
};

export default function ConversatinIdView({ conversationId }: Props) {
    const createMessage = useMutation(api.private.messages.create)
  const formSchema = z.object({
    message: z
      .string()
      .min(2, { message: "Message must be at least 2 characters long" })
      .nonempty(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: ""
    }
  })
  const onSubmit  = async(values: z.infer<typeof formSchema>)=> {
   
    try {
        
        await createMessage({
            conversationId,
            prompt: values.message
        })
         form.reset({ message: "" });
    } catch (error) {
        console.error(error)
    }
  }
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });


  const messages = useThreadMessages(api.private.messages.getMany, conversation?.threadId ? {threadId: conversation.threadId}:'skip', {
    initialNumItems: 10
  })


  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size={"sm"} variant={"ghost"}>
          <MoreHorizontalIcon />
        </Button>
      </header>
      <AIConversation className="min-h-[calc(100vh-175px)]">
      <AIConversationContent>
        {toUIMessages(messages.results ?? [])?.map((message)=> {
          return (
            <AIMessage from={message.role === 'user' ? 'assistant': 'user'}
            key={message.id}>
              <AIMessageContent>
                <AIResponse>
                  {message.text}
                </AIResponse>
              </AIMessageContent>
             {message.role === 'user' && (
              //TODO: When not sleepy know how to add the image
              <DiceBearAvatar seed={conversation?.contactSession?._id as string} size={32} />
             )}
            </AIMessage>
          )
        })}
      </AIConversationContent>
      <AIConversationScrollButton />
     </AIConversation>
     <div className="p-2">
        <Form {...form}>
            <AIInput onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} disabled={conversation?.status === 'resolved'} name="message" render={({field})=> (
                    <AIInputTextarea disabled={conversation?.status === 'resolved'  || form.formState.isSubmitting}  {...field}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }
            }}
            placeholder={
              conversation?.status === "resolved"
                ? "This conversation has been resolved"
                : "Type your response as an operator"
            } />
                )} />
                <AIInputToolbar>
                    <AIInputTools>
                        <AIInputButton>
                            <Wand2Icon />
                            Enhance
                        </AIInputButton>
                    </AIInputTools>
                    <AIInputSubmit disabled={conversation?.status === 'resolved' || !form.formState.isValid || form.formState.isSubmitting} status="ready" type="submit" />
                </AIInputToolbar>
            </AIInput>
        </Form>
     </div>
    </div>
  );
}
