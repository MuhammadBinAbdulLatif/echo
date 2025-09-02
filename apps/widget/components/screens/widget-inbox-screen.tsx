'use client'

import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "@/atoms/widget-atoms"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {formatDistanceToNow} from 'date-fns'
import React from 'react'
import WidgetHeader from "../widget-header"
import { AlertTriangleIcon, ArrowLeftIcon } from "lucide-react"
import WidgetFooter from "../widget-footer"
import { Button } from "@workspace/ui/components/button"
import { usePaginatedQuery } from "convex/react"
import { api } from "@workspace/backend/convex/_generated/api"
import ConversationStatusIcon from '@workspace/ui/components/conversation-status-icon'
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll"
import InfiniteScrollTrigger from "@workspace/ui/components/infinite-scroll-trigger"
function WidgetInboxScreen() {
    const setScreen = useSetAtom(screenAtom)
    const organizationId = useAtomValue(organizationIdAtom)
    const setConversationId = useSetAtom(conversationIdAtom)
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ''))
    const conversations = usePaginatedQuery(api.public.conversations.getMany, contactSessionId ? {contactSessionId}: 'skip', {
      initialNumItems: 10
    })
  const {canLoadMore,handleLoadMore,isExhausted,isLoadingFirstPage,isLoadingMore,topElementRef} = useInfiniteScroll({
    status: conversations.status,
    loadMore: conversations.loadMore,
    loadSize: 10,
    observerEnabled: false
  })
  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2 text-xl">
         <Button variant={'transparent'} size={'icon'} onClick={()=> setScreen('selection')}>
          <ArrowLeftIcon />
          <p>
            Inbox
          </p>
         </Button>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 overflow-y-auto gap-y-2 p-4 flex-col">
       {conversations?.results.map((conversation)=> (
        <Button className="h-12 w-full justify-between" key={conversation._id} onClick={()=> {
          setConversationId(conversation._id)
          setScreen('chat')
        }} variant={'outline'}>
          <div className="flex w-full flex-col gap4 overflow-hidden text-start">
            <div className="flex w-full items-center justify-between  gap-x-2">
              <p className="text-muted-foreground text-xs">
                Chat
              </p>
               <p className="text-muted-foreground text-xs">
                {formatDistanceToNow(new Date(conversation._creationTime))}
              </p>
              
            </div>
            <div className="flex w-full items-center justify-between gap-x-2">
              <p className="truncate text-sm">
                {conversation.lastMessage?.text}
              </p>
              <ConversationStatusIcon status={conversation.status} className="shrink-0" />
            </div>

          </div>
        </Button>
       ))}
       <InfiniteScrollTrigger loadMoreText="Load more..." canLoadMore={canLoadMore} isLoadingMore={isLoadingMore} onLoadMore={handleLoadMore} ref={topElementRef} />
      </div>
      <WidgetFooter />
    </>
  )
}

export default WidgetInboxScreen
