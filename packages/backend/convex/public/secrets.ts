// public keys will always be availabe in the frontend that is literally what they mean and when you use NEXT_PUBLIC it automatically exports them

import { v } from "convex/values";
import { internal } from "../_generated/api.js";
import { getSecretValue, parseSecretString } from "../lib/secrets.js";
import { action } from "../_generated/server.js";

export const getVapiSecrets = action({
  args: {
    organizationId: v.string(),
  },
  handler: async (ctx, args) => {
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: args.organizationId,
        service: "vapi",
      }
    );
    if (!plugin) {
      return null;
    }
    const secretName = plugin.secretName;
    const secret = await getSecretValue(secretName);
    const secretData = parseSecretString<{
      privateApiKey: string;
      publicApiKey: string;
    }>(secret);
    // the private ones should only be used for our backend NO WHERE ELSE
    if (!secretData?.publicApiKey) {
      return null;
    }
    if (!secretData.privateApiKey) {
      return null;
    }
    return {
      publicApiKey: secretData.publicApiKey,
    };
  },
});
