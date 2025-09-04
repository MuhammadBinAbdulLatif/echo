"use client";

import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useAction, useMutation, useQuery } from "convex/react";
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react";
import React, { useState } from "react";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import infiniteScorllTrigger  from '@workspace/ui/components/infinite-scroll-trigger'
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
import ConversationStatusButton from "./conversation-status-button";
import InfiniteScrollTrigger from "@workspace/ui/components/infinite-scroll-trigger";
import { Skeleton } from "@workspace/ui/components/skeleton";
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
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
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

  const enhanceResponse = useAction(api.private.messages.enhance);
  const handleEnhacneReponse = async ()=> {
    setIsEnhancing(true)
    try {
      
      const response = await enhanceResponse({prompt: form.getValues('message')})
      form.setValue("message", response)
    } catch (error) {
      console.error(error)
    } finally {
      setIsEnhancing(false)
    }
  }


  const messages = useThreadMessages(api.private.messages.getMany, conversation?.threadId ? {threadId: conversation.threadId}:'skip', {
    initialNumItems: 10
  })

  const {topElementRef, handleLoadMore, canLoadMore, isLoadingMore} = useInfiniteScroll({
    status: messages.status,
    loadMore: messages.loadMore,
    loadSize: 10
  })
  const updateStatus = useMutation(api.private.conversations.updateStatus);
  const handleToggleStatus = async ()=> {
    setIsUpdatingStatus(true)
    console.log('FUnction being called')
    if(!conversation){
      return
    }
    
    let newStatus: 'unresolved' | 'resolved' | 'escalated'
    if(conversation.status === 'unresolved'){
      newStatus = 'escalated'
    }
    
    else if(conversation.status === 'escalated'){
      newStatus = 'resolved'
    }
    else {
      newStatus = 'unresolved'
    }

    try {
      console.log('reached try')
      console.log(newStatus)
      await updateStatus({
        conversationId: conversationId,
        status: newStatus
      }) 
      console.log('completed try')
    } catch(error) {
      console.log(error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if(conversation === undefined || messages.status === 'LoadingFirstPage'){
    return <ConversationSkeleton />
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size={"sm"} variant={"ghost"}>
          <MoreHorizontalIcon />
        </Button>
        {!!conversation && (<ConversationStatusButton disabled={isUpdatingStatus} onClick={handleToggleStatus} status={conversation?.status} />)}
      </header>
      <AIConversation className="min-h-[calc(100vh-175px)]">
      <AIConversationContent>
        <InfiniteScrollTrigger canLoadMore={canLoadMore} isLoadingMore={isLoadingMore} onLoadMore={handleLoadMore} ref={topElementRef} loadMoreText="Load more..." noMoreText="You have seen all of it" />
        {toUIMessages(messages.results ?? [])?.map((message)=> {
          if (!message.text || message.text.trim() === '') {
            return null;
          }
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
                    <AIInputTextarea disabled={conversation?.status === 'resolved'  || form.formState.isSubmitting || isEnhancing}  {...field}
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
                        <AIInputButton disabled={conversation?.status === 'resolved' || isEnhancing || !form.formState.isValid} onClick={handleEnhacneReponse}>
                            <Wand2Icon />
                            {isEnhancing ? 'Enhancing...': "Enhance"}
                        </AIInputButton>
                    </AIInputTools>
                    <AIInputSubmit disabled={conversation?.status === 'resolved' || !form.formState.isValid || form.formState.isSubmitting || isEnhancing} status="ready" type="submit" />
                </AIInputToolbar>
            </AIInput>
        </Form>
     </div>
    </div>
  );
}



 function ConversationSkeleton() {
  return (
    <div className="flex h-full flex-col bg-muted ">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button disabled size="sm" variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </header>

      <AIConversation className="min-h-[calc(100vh-180px)]">
        <AIConversationContent>
          {Array.from({ length: 8 }, (_, index) => {
            const isUser = index % 2 === 0
            const widths = ["w-48", "w-60", "w-72"]
            const width = widths[index % widths.length]

            return (
              <div
                key={index}
                className={`flex my-2 ${isUser ? "justify-end" : "justify-start"}`}
              >
                <Skeleton className={`h-6 rounded-lg ${width}`} />
              </div>
            )
          })}
        </AIConversationContent>
      </AIConversation>
    </div>
  )
}
