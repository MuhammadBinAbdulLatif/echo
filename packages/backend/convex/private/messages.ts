import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "../_generated/server.js";
import { components, internal } from "../_generated/api.js";
import { agent } from "../system/ai/agents/supportAgent.js";
import { paginationOptsValidator } from "convex/server";
import { saveMessage } from "@convex-dev/agent";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { OPERATOR_MESSAGE_ENHANCEMENT_PROMPT } from "../system/ai/constants.js";

export const create = mutation({
  args: {
    prompt: v.string(),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, arg) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "The user is not logged in ",
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "No organization Id found",
      });
    }

    // get the contact session
    const conversation = await ctx.db.get(arg.conversationId);
    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "The conversation is invalid or does not exist.",
      });
    }
    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid Organization id",
      });
    }
    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "The conversation has already been resolved.",
      });
    }

    if (conversation.status === "unresolved") {
      await ctx.db.patch(conversation._id, { status: "escalated" });
    }

    // TODO: Implement subscription check / subscription paywall
    await saveMessage(ctx, components.agent, {
      threadId: conversation.threadId,
      agentName: identity.familyName,
      message: {
        role: "assistant",
        content: arg.prompt,
      },
    });
  },
});

export const getMany = query({
  args: {
    // threadId to search from and the pagination options is handled internally by convex, the greatest of the BAAS
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, arg) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "The user is not logged in ",
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "No organization Id found",
      });
    }
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", arg.threadId))
      .unique();
    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }
    if (conversation.organizationId != orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Invalid organization Id",
      });
    }
    const paginated = await agent.listMessages(ctx, {
      threadId: arg.threadId,
      paginationOpts: arg.paginationOpts,
    });
    return paginated;
  },
});

export const enhance = action({
  args: {
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "The user is not logged in ",
      });
    }
    const orgId = identity.orgId as string;
    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "No organization Id found",
      });
    }

    const response = await generateText({
      model: google.chat("gemini-1.5-flash"),
      messages: [
        {
          role: "system",
          content: OPERATOR_MESSAGE_ENHANCEMENT_PROMPT,
        },
        {
          role: "user",
          content: `This is the message of the operator: ${args.prompt}`,
        },
      ],
    });
    return response.text;
  },
});
