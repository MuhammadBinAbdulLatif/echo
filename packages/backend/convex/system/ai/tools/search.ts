import { google } from "@ai-sdk/google";
import { createTool } from "@convex-dev/agent";
import { generateText } from "ai";
import z from "zod";
import { internal } from "@workspace/backend/convex/_generated/api.js";
import { agent } from "../agents/supportAgent.js";
import { rag } from "../rag.js";
import { query } from "@workspace/backend/convex/_generated/server.js";
import { SEARCH_INTERPRETER_PROMPT } from "../constants.js";

export const search = createTool({
  description:
    "Search the knowledge base for relevant information to help the answer user questions",
  args: z.object({
    query: z.string().describe("The search query to find relevant information"),
  }),
  handler: async (ctx, args) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }
    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      { threadId: ctx.threadId }
    );
    if (!conversation) {
      return "No conversation found";
    }
    const orgId = conversation.organizationId;
    const searchResult = await rag.search(ctx, {
      namespace: orgId,
      query: args.query,
      limit: 5,
    });
    const contextText = `Found result in ${searchResult.entries
      .map((e) => e.title || null)
      .filter((t) => t !== null)
      .join(", ")}. Here is the context:\n\n ${searchResult.text}`;
    const response = await generateText({
      messages: [
        {
          role: "system",
          content: SEARCH_INTERPRETER_PROMPT,
        },
        {
          role: "user",
          content: `User asked "${args.query}"\n \n Search Results: ${contextText}`,
        },
      ],
      model: google.chat("gemini-2.0-flash"),
    });
    await agent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: response.text,
      },
    });
  },
});
