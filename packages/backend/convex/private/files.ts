import { ConvexError, v } from "convex/values";
import { action, mutation } from "../_generated/server.js";
import {
  contentHashFromArrayBuffer,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId,
} from "@convex-dev/rag";
import { extractTextContent } from "../lib/extractTextContent.js";
import { rag } from "../system/ai/rag.js";
import { Id } from "../_generated/dataModel.js";
function guessMimeType(fileName: string, bytes: ArrayBuffer): string {
  return (
    guessMimeTypeFromExtension(fileName) ||
    guessMimeTypeFromContents(bytes) ||
    "application/octet-stream"
  );
}
export const addFile = action({
  args: {
    fileName: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
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

    const { bytes, fileName, category } = args;
    const mimeType = args.mimeType || guessMimeType(fileName, bytes);

    const blob = new Blob([bytes], { type: mimeType });
    const storageId = await ctx.storage.store(blob);

    const text = await extractTextContent(ctx, {
      storageId,
      fileName,
      bytes,
      mimeType,
    });
    const { entryId, created } = await rag.add(ctx, {
      namespace: orgId,
      text: text,
      key: fileName,
      title: fileName,
      metadata: {
        storageId,
        uploadedBy: orgId,
        filename: fileName,
        category: category ?? null,
      },
      contentHash: await contentHashFromArrayBuffer(bytes), /// to avoid reinserting if the file has not change
    });
    if (!created) {
      console.debug("entry already exists, skipping uploading metadata");
      await ctx.storage.delete(storageId);
    }
    return {
      url: await ctx.storage.getUrl(storageId),
      entryId,
    };
  },
});

export const deleteFile = mutation({
  args: {
    entryId: vEntryId,
  },
  handler: async (ctx, args) => {
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

    // Do we have the permission to delte this entry (it belongs to our name space)
    const namespace = await rag.getNamespace(ctx, {
      namespace: orgId,
    });
    if (!namespace) {
      throw new ConvexError({
        code: "UNAUTHROIZED",
        message: "Invalid Namespace",
      });
    }

    const entry = await rag.getEntry(ctx, {
      entryId: args.entryId,
    });
    if (!entry) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Entry not found",
      });
    }
    if (entry.metadata?.uploadedBy !== orgId) {
      throw new ConvexError({
        code: "Unauthrozed",
        message: "Invalid organization ID",
      });
    }
    if (entry.metadata?.storageId) {
      // When you upload a file, you upload it to storage and then the text of the file to the rag
      await ctx.storage.delete(entry.metadata?.storageId as Id<"_storage">);
    }
    await rag.deleteAsync(ctx, {
      entryId: args.entryId,
    });
  },
});
