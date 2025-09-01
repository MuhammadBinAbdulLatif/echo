import { mutation, query } from "../_generated/server.js";
import { ConvexError, v } from "convex/values";
import { agent } from "../system/ai/agents/supportAgent.js";
import { saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api.js";

export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, arg) => {
    const session = await ctx.db.get(arg.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZIED",
        message: "Invalid Session",
      });
    }
    // an example thread, replace when functionality for thread creation is in place
    const {threadId} = await agent.createThread(ctx,{
      userId: arg.organizationId
    })
    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: 'assistant',
        // TODO: add the custom one for the user
        content: 'How can i help you today'
      }
    })
    // Create the conversation
    const conversationId = await ctx.db.insert("conversations", {
      contactSessionId: session._id,
      organizationId: arg.organizationId,
      status: "unresolved",
      threadId,
    });
    return conversationId;
  },
});

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, arg) => {
    const session = await ctx.db.get(arg.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZIED",
        message: "Invalid Session",
      });
    }
    const conversation = await ctx.db.get(arg.conversationId);
    if(!conversation){
         throw new ConvexError({
         code: "NOT_FOUND",
        message: "Conversation Not Found",
      })
    }
    if (conversation.contactSessionId !== session._id) {
      throw new ConvexError({
         code: "UNAUTHORIZIED",
        message: "Incorrect Session",
      })
    }
    return {
        _id: conversation._id,
        status: conversation.status,
        threadId:conversation.threadId
    }
  },
});
