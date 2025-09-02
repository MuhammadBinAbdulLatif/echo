"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon, CornerUpLeftIcon, ListIcon } from "lucide-react";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { getCountryFromTimezone } from "@/hooks/contry-utils";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";
import { DiceBearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { formatDistanceToNow } from "date-fns";
import ConversationStatusIcon from '@workspace/ui/components/conversation-status-icon'
function ConversationsPanel() {
  const conversations = usePaginatedQuery(
    api.private.conversations.getMany,
    {
      status: undefined,
    },
    {
      initialNumItems: 10,
    }
  );
  const pathname = usePathname();
  return (
    <div className="flex h-full w-full flex-col bg-background text-sidebar-foreground">
      <div className="flex flex-col gap-3.5 border-b p-2">
        <Select defaultValue="all" onValueChange={() => {}} value="all">
          <SelectTrigger className="h-8 border-none px-1.5 shadow-none ring-0 hover:bg-accent hover:text-accent-foreground focus-visible:ring-0">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <ListIcon className="size-4" />
                <span>All</span>
              </div>
            </SelectItem>
            <SelectItem value="unresolved">
              <div className="flex items-center gap-2">
                <ArrowRightIcon className="size-4" />
                <span>Unresolved</span>
              </div>
            </SelectItem>
            <SelectItem value="escalted">
              <div className="flex items-center gap-2">
                <ArrowUpIcon className="size-4" />
                <span>Escalated</span>
              </div>
            </SelectItem>
            <SelectItem value="resolved">
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <span>Resolved</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="max-h-[calc(100vh-53px)">
        <div className="flex w-full flex-1 flex-col text-sm">
          {conversations.results.map((conversation) => {
            const isLastMessageFromOperator =
              conversation.lastMessage?.message?.role == "user";
            const country = getCountryFromTimezone(
              conversation.contactSession.metadata?.timezone
            );
            const countryFlagUrl = "/logo.svg";
            return (
              <Link
                href={`/conversations/${conversation._id}`}
                key={conversation._id}
                className={cn(
                  "relative flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground ",
                  pathname === `/conversations/${conversation._id}` &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <div
                  className={cn(
                    "-translate-y-1/2 absolute top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity",
                    pathname === `/conversations/${conversation._id}` &&
                      "opacity-100"
                  )}
                />
                <DiceBearAvatar
                  seed={conversation.contactSession._id}
                  size={40}
                  className="shrink-0"
                />
                <div className="flex-1">
                  <div className="flex w-full items-center gap-2">
                    <span className="turncate font-bold">
                      {conversation.contactSession.name}
                    </span>
                    <span className="ml-auto shrink-0 text-muted-foreground text-xs">
                      {formatDistanceToNow(conversation._creationTime)}
                    </span>
                  </div>
                  <div className={'mt-1 flex items-center justify-between gap-2'}>
                    <div className="flex w-0 grow items-center gap-1">
                        {isLastMessageFromOperator && (
                            <CornerUpLeftIcon className="size-3 shrink-0 text-muted-foreground" />
                        ) }
                        <span className={cn('line-clamp-1 text-xs text-muted-foreground', isLastMessageFromOperator && 'font-bold text-black')}>
                            {conversation.lastMessage?.text}
                        </span>
                    </div>
                    <ConversationStatusIcon status={conversation.status} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default ConversationsPanel;
