import { defineSchema,defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string()
    }).index("name_index", ["name"]),
})