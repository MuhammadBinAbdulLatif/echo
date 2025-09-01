import { ConvexError, v } from "convex/values";
import { action, query } from "../_generated/server.js";
import { internal } from "../_generated/api.js";
import { agent } from "../system/ai/agents/supportAgent.js";
import { paginationOptsValidator } from "convex/server";

export const create = action({
    args: {
        prompt: v.string(),
        threadId: v.string(),
        contactSessionId: v.id('contactSessions')
    },
    handler: async (ctx, arg) => {
        // get the contact session
        const contactSession = await ctx.runQuery(internal.system.contactSessions.getOne, {contactSessionId: arg.contactSessionId})
        if(!contactSession || contactSession.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "The contact session is invalid or has expired."
            })
        }
        const conversation = await ctx.runQuery(internal.system.conversations.getByThreadId, {threadId: arg.threadId})
        if(!conversation) {
            throw new ConvexError({
                code: "NOT_FOUND",
                message: "The conversation is invalid or does not exist."
            })
        }
        if(conversation.status === 'resolved') {
            throw new ConvexError({
                code: "BAD_REQUEST",
                message: "The conversation has already been resolved."
            })
        }
        // TODO: Implement subscription check / subscription paywall
        await agent.generateText(ctx, {
            threadId: arg.threadId
        }, {
            prompt: arg.prompt,
        })
    }
}) 

export const getMany  = query({
    args: {
        // threadId to search from and the pagination options is handled internally by convex, the greatest of the BAAS
        threadId: v.string(),
       paginationOpts: paginationOptsValidator,
       contactSessionId: v.id('contactSessions')
    }, 
    handler: async (ctx, arg) => {
        const contactSession = await ctx.db.get(arg.contactSessionId)
        if(!contactSession || contactSession.expiresAt < Date.now()) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "The contact session is invalid or has expired."
            })
        }
        const paginated = await agent.listMessages(ctx, {
            threadId: arg.threadId,
            paginationOpts: arg.paginationOpts
        })
        return paginated
    }
})