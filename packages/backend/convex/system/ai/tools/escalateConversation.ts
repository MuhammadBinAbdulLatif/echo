import { createTool } from "@convex-dev/agent";
import {z} from 'zod'
import { internal } from "@workspace/backend/convex/_generated/api.js";

import { agent } from "../agents/supportAgent.js";

export const escalateConversation = createTool({
    description: 'Resolve a conversationg (meaning that the requirement/question of the user is answered',
    args: z.object({}),
    handler: async (ctx)=> {
        if(!ctx.threadId) {
            return "Missing thread Id"
        }
        await ctx.runMutation(internal.system.conversations.escalate, {
            threadId: ctx.threadId,
        })

        await agent.saveMessage(ctx, {
            threadId: ctx.threadId,
            message: {
                role: "assistant",
                content: 'Conversation escalated to a human operator'
            }
        })
        return "Conversation escalated"
    }
})