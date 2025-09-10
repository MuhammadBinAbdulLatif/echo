import { ConvexError } from "convex/values";
import { internal } from "../_generated/api.js";
import { action } from "../_generated/server.js";
import { getSecretValue, parseSecretString } from "../lib/secrets.js";
import { VapiClient, Vapi } from "@vapi-ai/server-sdk";
export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx, args): Promise<Vapi.PhoneNumbersListResponseItem[]> => {
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
    // we will have to obtain the plugin secret name and using that we will call the aws api to get the secrets
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    );
    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }
    const secretName = plugin.secretName;
    const secret = await getSecretValue(secretName);

    const secretData = parseSecretString<{
      privateApiKey: string;
      publicApiKey: string;
    }>(secret);
    if (!secretData) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "credentials not found in aws",
      });
    }
    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials Incomplete. Please reconnect your vapi account",
      });
    }
    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });
    const phoneNumbers = await vapiClient.phoneNumbers.list();
    return phoneNumbers;
  },
});

export const getAssistants = action({
  args: {},
  handler: async (ctx): Promise<Vapi.Assistant[]> => {
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
    // we will have to obtain the plugin secret name and using that we will call the aws api to get the secrets
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    );
    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      });
    }
    const secretName = plugin.secretName;
    const secret = await getSecretValue(secretName);
    const secretData = parseSecretString<{
      privateApiKey: string;
      publicApiKey: string;
    }>(secret);
    if (!secretData) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "credentials not found in aws",
      });
    }
    if (!secretData.privateApiKey || !secretData.publicApiKey) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Credentials Incomplete. Please reconnect your vapi account",
      });
    }
    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });
    const assistants = await vapiClient.assistants.list();
    return assistants;
  },
});
