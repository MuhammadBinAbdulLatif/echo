import { internalQuery } from "../_generated/server.js";

import {v} from 'convex/values';

export const getOne = internalQuery({
    args: {contactSessionId: v.id('contactSessions')},
    handler: async (ctx, arg) => {
        return await ctx.db.get(arg.contactSessionId);
    }
})