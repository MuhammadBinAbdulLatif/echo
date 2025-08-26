import { mutation, query } from "./_generated/server.js";

import { v } from "convex/values";

// Return the last 100 tasks in a given task list.
export const getManyUsers = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db
            .query("users")
            .collect()
        return users;
    },
});

export const someMutation = mutation({
    args: {
        name: v.string(),
    }, 
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(identity === null) {
            throw new Error('Not authenticated')
        }
        const { name } = args;
        const user = await ctx.db
            .insert("users", { name })
            
        return user;
    }
})