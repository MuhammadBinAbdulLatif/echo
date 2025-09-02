import { mutation, query } from "../_generated/server.js";
import { ConvexError, v } from "convex/values";
import { agent } from "../system/ai/agents/supportAgent.js";
import { Message, MessageDoc, saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api.js";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { Doc } from "../_generated/dataModel.js";




export const getMany = query({
  args: {
    status:v.optional( v.union(v.literal('unresolved'), v.literal('escalated'), v.literal('resolved'))),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, arg)=> {
    const identity = await ctx.auth.getUserIdentity()
    if(identity === null){
        throw new ConvexError({
            code: "UNAUTHORIZED",
            message: 'The user is not logged in '
        })
    }
    const orgId = identity.orgId as string;
    if(!orgId){
        throw new ConvexError({
            code: "UNAUTHORIZED",
            message: 'No organization Id found'
        })
    }

    let conversations: PaginationResult<Doc<'conversations'>>;
    if(arg.status) {
        conversations = await ctx.db.query('conversations').withIndex('by_status_and_organization_id', (q)=> q.eq('status', arg.status as "unresolved" | "escalated" | "resolved").eq('organizationId', orgId)).order('desc').paginate(arg.paginationOpts)
    } else {
        conversations = await ctx.db.query('conversations').withIndex('by_organization_id', (q)=> q.eq('organizationId', orgId)).order('desc').paginate(arg.paginationOpts)
    }
    const conversationsWithAdditionalData = await Promise.all(conversations.page.map(async (conversation)=> {
        let lastMessage: MessageDoc | null = null;
        const contactSession = await ctx.db.get(conversation.contactSessionId);
        if(!contactSession){
            return null;
        }

        const messages = await agent.listMessages(ctx, {
            threadId: conversation.threadId,
            paginationOpts: {numItems: 1, cursor: null}
        });
        if(messages.page.length > 0){
            lastMessage = messages.page[0] ?? null
        }
        return {
            ...conversation,
            lastMessage,
            contactSession,
        }
    }))


    const validConversations = conversationsWithAdditionalData.filter(
        (conv): conv is NonNullable <typeof conv> => conv !==null
    )
    return {
        ...conversations,
        page: validConversations,
    };
  }
})