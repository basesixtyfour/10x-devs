import { z } from "zod";

export const DEFAULT_MODEL = "google/gemini-2.5-flash-lite";
export const ALLOWED_MODELS: string[] = [
  "google/gemini-2.5-flash-lite",
  "google/gemini-2.5-pro",
  "openai/gpt-5.1",
  "x-ai/grok-4.1-fast",
  "perplexity/sonar-pro-search",
];

export const PaginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(40).default(40),
  skip: z.coerce.number().int().min(0).default(0),
});

export const MessageSchema = z.object({
  message: z.string().min(1).max(10000),
  model: z.string().optional().refine(
    (val) => !val || ALLOWED_MODELS.length === 0 || ALLOWED_MODELS.includes(val),
    {
      message: "Invalid model selected",
    }
  ),
});

export const NewChatSchema = z.object({
  systemPrompt: z.string().min(1).max(10000),
  message: z.string().min(1).max(10000),
});

export const ChatIdSchema = z.object({
  chatId: z.uuid(),
});

export const UpdateChatSchema = z.object({
  title: z.string().min(1).max(200),
});

export type Pagination = z.infer<typeof PaginationSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type NewChat = z.infer<typeof NewChatSchema>;
export type ChatId = z.infer<typeof ChatIdSchema>;
export type UpdateChat = z.infer<typeof UpdateChatSchema>;