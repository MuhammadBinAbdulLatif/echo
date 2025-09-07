// there should be no dash in the files of convex. Something on their end
import { components } from "../../../_generated/api.js";
import { Agent } from "@convex-dev/agent";
import { google } from "@ai-sdk/google";
import { resolveConversation } from "../tools/resolveConversation.js";
import { escalateConversation } from "../tools/escalateConversation.js";
import { SUPPORT_AGENT_PROMPT } from "../constants.js";

export const agent = new Agent(components.agent, {
  name: "Jhon",
  languageModel: google.chat("gemini-2.5-flash"),
  instructions: SUPPORT_AGENT_PROMPT,
});

// it is good to use ai sdks and i am so happy to do so.
