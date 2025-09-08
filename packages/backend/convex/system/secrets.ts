import { v } from "convex/values";
import { internal } from "../_generated/api.js";
import { internalAction } from "../_generated/server.js";
import { upsertSecret } from "../lib/secrets.js";

export const upsert = internalAction({
  args: {
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    const secretName = `tenant/${args.organizationId}/${args.service}`;
    // tenant/1234/vapi or /google or /vercel or whatever the service you are intergating to
    await upsertSecret(secretName, args.value);
    // create the record in the database (just the record not the secret api / secret / key)
    // we cannot access the database directly in an internal action and that is why we created separate ones
    await ctx.runMutation(internal.system.plugins.upsert, {
      organizatoinId: args.organizationId,
      service: args.service,
      secretName,
    });
    return { status: "success" };
  },
});
