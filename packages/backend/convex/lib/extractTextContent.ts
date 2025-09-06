import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import type { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";
import { Id } from "../_generated/dataModel.js";

const AI_MODELS = {
  image: google.chat("gemini-2.5-flash"),
  pdf: google.chat("gemini-2.5-flash"),
  html: google.chat("gemini-2.5-flash"),
} as const;

const SUPPORTED_IMAGE_TYPES = [
  // we want to allow them to upload the supported images. We could have done the same for the audios had we been using the chatgpt because google does not provide the 'transcribe' function
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

const SYSTEM_PROMPTS = {
  image:
    "You turn the images into text. If it is a photo of a document, transcribe it. If it is not a document, describe it",
  pdf: "You transform PDF files into text",
  html: "You transfrom content in markdown",
};

export type ExtractTextContentArgs = {
  storageId: Id<"_storage">;
  fileName: string;
  bytes?: ArrayBuffer;
  mimeType: string;
};

async function extractPdfText(url: string, mimeType: string, fileName: string) {
  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPTS.pdf,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: new URL(url),
            filename: fileName,
            mediaType: mimeType,
          },
          {
            type: "text",
            text: "Extract the text from the pdf and say nothing (no words of your own) but the text in the pdf.",
          },
        ],
      },
    ],
  });
  return result.text;
}

async function extractTextFileContent(
  ctx: { storage: StorageActionWriter },
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mimeType: string
): Promise<string> {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());
  if (!arrayBuffer) {
    throw new Error("Failed to get file content");
  }
  const text = new TextDecoder().decode(arrayBuffer);
  if (mimeType.toLocaleLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text },
            {
              type: "text",
              text: "Extract the text and print in in a markdown format. Add nothing of your own to the answer as this will be directly pasted to a file. Return only the contents of text in markdown",
            },
          ],
        },
      ],
    });
    return result.text;
  }
  return text;
}

export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: ExtractTextContentArgs
): Promise<string> {
  const { fileName, mimeType, storageId, bytes } = args;
  const url = await ctx.storage.getUrl(storageId);
  assert(url, "failed to get a url");
  const a = url;
  if (SUPPORTED_IMAGE_TYPES.some((type) => type === mimeType)) {
    return extractImageText(url);
  }
  if (mimeType.toLowerCase().includes("pdf")) {
    return extractPdfText(url, mimeType, fileName);
  }
  if (mimeType.toLowerCase().includes("text")) {
    return extractTextFileContent(ctx, storageId, bytes, mimeType);
  }
  throw new Error(`Unsupported mime type: ${mimeType}`);
}

async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image,
    system: SYSTEM_PROMPTS.image,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  });
  return result.text;
}
