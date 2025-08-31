import { threadId } from "worker_threads";
import { mutation, query } from "../_generated/server.js";
import { ConvexError, v } from "convex/values";

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
    const threadId = "123";
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
        return null;
    }
    return {
        _id: conversation._id,
        status: conversation.status,
        threadId:conversation.threadId
    }
  },
});
