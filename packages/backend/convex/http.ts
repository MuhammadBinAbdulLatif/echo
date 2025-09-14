import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server.js";
import { Webhook } from "svix";
import { createClerkClient } from "@clerk/backend";
import type { WebhookEvent } from "@clerk/backend";
import { internal } from "./_generated/api.js";
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});
const http = httpRouter();
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequestion(request);

    if (!event) {
      return new Response("Error Ocuured", { status: 400 });
    }
    switch (event.type) {
      case "subscription.updated":
        const subscription = event.data as {
          status: string;
          payer?: {
            organization_id: string;
          };
        };
        const newMaxAllowedMemberships =
          subscription.status === "active" ? 5 : 1;
        const organizationId = subscription.payer?.organization_id;
        if (!organizationId) {
          return new Response("Missing organization Id");
        }
        await clerkClient.organizations.updateOrganization(organizationId, {
          maxAllowedMemberships: newMaxAllowedMemberships,
        });
        await ctx.runMutation(internal.system.subscriptions.upsert, {
          organizationId,
          status: subscription.status,
        });
        return new Response(null, { status: 200 });
      default:
        console.log("Ingored clerk webhook event", event.type);
        return new Response(null, { status: 200 });
    }
  }),
});

async function validateRequestion(req: Request): Promise<WebhookEvent | null> {
  // make sure the headers match.
  const payloadStrng = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadStrng, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error(error, "Error verifying webhook event");
    return null;
  }
}
export default http;
