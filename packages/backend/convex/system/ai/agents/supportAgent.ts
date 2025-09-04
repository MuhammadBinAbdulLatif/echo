// there should be no dash in the files of convex. Something on their end
import { components } from "../../../_generated/api.js";
import { Agent } from "@convex-dev/agent";
import { google } from "@ai-sdk/google";
import { resolveConversation } from "../tools/resolveConversation.js";
import { escalateConversation } from "../tools/escalateConversation.js";

export const agent = new Agent(components.agent, {
  name: "Jhon",
  languageModel: google.chat("gemini-2.5-flash"),
  instructions:
    'You are a customer support agent. Use "resolve conversation" tool when user is satisfied and his concern is resolved. Use "escalateConversation" when the user shows frustration or demands a human operator. Always provide a helpful response after using any tool - explain what you did and offer additional assistance if needed.',
});

// it is good to use ai sdks and i am so happy to do so.
