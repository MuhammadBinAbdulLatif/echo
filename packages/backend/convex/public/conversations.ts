import { mutation, query } from "../_generated/server.js";
import { ConvexError, v } from "convex/values";
import { agent } from "../system/ai/agents/supportAgent.js";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api.js";
import { paginationOptsValidator } from "convex/server";

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


export const getMany = query({
  args: {
    contactSessionId: v.id('contactSessions'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, arg)=> {
    const contactSession = await ctx.db.get(arg.contactSessionId);
    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZIED",
        message: "Invalid Session",
      });
    }
    const conversations = await ctx.db.query('conversations').withIndex('by_contact_session_id', (q)=> q.eq('contactSessionId', arg.contactSessionId)).order('desc').paginate(arg.paginationOpts)

    const conversationWithLastMessage = await Promise.all(conversations.page.map(async (conversation)=> {
      let lastMessage: MessageDoc | null = null;
      const messages = await agent.listMessages(ctx, {
        threadId: conversation.threadId,
        paginationOpts: {numItems: 1, cursor: null}
      })
      if(messages.page.length > 0){
        lastMessage = messages.page[0] ?? null
      }
      return {
        _id: conversation._id,
        _creationTime: conversation._creationTime,
        status: conversation.status,
        organizationId: conversation.organizationId,
        threadId: conversation.threadId,
        lastMessage: lastMessage
      }
    })
  
  );
  return {
    ...conversations,
    page: conversationWithLastMessage
  };
  }
})