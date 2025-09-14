import { internalMutation, internalQuery } from "../_generated/server.js";

import { ConvexError, v } from "convex/values";

export const getOne = internalQuery({
  args: { contactSessionId: v.id("contactSessions") },
  handler: async (ctx, arg) => {
    return await ctx.db.get(arg.contactSessionId);
  },
});
const SESSION_DURATION = 24 * 60 * 60 * 1000;
const AUTO_REFRESH_THRESHOLD_MS = 4 * 60 * 60 * 1000;

export const refresh = internalMutation({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    if (!contactSession) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Contact Session Not found",
      });
    }
    if (contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Contact Session has expired",
      });
    }
    const timeRemaining = contactSession.expiresAt - Date.now();
    if (timeRemaining < AUTO_REFRESH_THRESHOLD_MS) {
      const newExpiresAt = Date.now() + SESSION_DURATION;
      await ctx.db.patch(args.contactSessionId, {
        expiresAt: newExpiresAt,
      });
      return { ...contactSession, expiresAt: newExpiresAt };
    }
    return contactSession;
  },
});
