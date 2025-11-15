import { prisma } from "../prisma";
import { Role } from "@prisma/client";
import { Pagination } from "./validation";
import { openai } from "./openai";

export async function getChats(userId: string, { limit, skip }: Pagination) {
  const chats = await prisma.chat.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: skip,
  });
  return chats;
}

export async function createNewChat(
  userId: string,
  systemPrompt: string,
  message: string,
) {
  const chat = await prisma.chat.create({
    data: {
      userId: userId,
      title: "New Chat",
      messages: {
        create: [{ role: Role.system, content: systemPrompt }],
      },
    },
  });

  const formattedMessages = [
    {
      role: Role.system,
      content:
        "Summarize the following chat in 2 to 3 words. Keep it concise and descriptive.",
    },
    { role: Role.user, content: message },
  ];

  const chatTitleResponse = await openai.chat.completions.create({
    model: "google/gemini-2.5-flash-lite",
    messages: formattedMessages,
  });

  const chatTitle = chatTitleResponse.choices[0].message.content;

  await prisma.chat.update({
    where: { id: chat.id },
    data: { title: chatTitle },
  });

  return { ...chat, title: chatTitle };
}

export async function deleteChat(userId: string, chatId: string) {
  await prisma.chat.delete({
    where: {
      id: chatId,
      userId: userId,
    },
  });

  return { id: chatId };
}

export async function updateChatTitle(
  userId: string,
  chatId: string,
  title: string,
) {
  const chat = await prisma.chat.update({
    where: {
      id: chatId,
      userId: userId,
    },
    data: {
      title: title,
    },
  });

  return chat;
}

export async function deleteMessage(chatId: string, messageId: string) {
  await prisma.message.delete({
    where: {
      id: messageId,
      chatId: chatId,
    },
  });

  return { id: chatId };
}

export async function getChat(userId: string, chatId: string) {
  return await prisma.chat.findFirstOrThrow({
    where: { id: chatId, userId: userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getChatMessages(userId: string, chatId: string) {
  const chat = await prisma.chat.findFirstOrThrow({
    where: {
      id: chatId,
      userId: userId,
    },
  });

  const messages = await prisma.message.findMany({
    where: { chatId: chatId },
    orderBy: { createdAt: "asc" },
  });

  return messages;
}

export async function createChatMessage(
  userId: string,
  chatId: string,
  message: string,
  role: Role,
) {
  await prisma.chat.findFirstOrThrow({
    where: {
      id: chatId,
      userId: userId,
    },
  });

  return await prisma.message.create({
    data: { content: message, role: role, chatId: chatId },
  });
}

export async function storeStreamToDatabase(
  stream: ReadableStream,
  userId: string,
  chatId: string,
  isAborted: () => boolean,
) {
  try {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";
    let chunk = "";
    const MAX_CONTENT_SIZE = 100000;

    while (!isAborted()) {
      const { done, value } = await reader.read();
      if (done) break;

      chunk += decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");
      chunk = lines.pop() || "";
      for (const line of lines) {
        if (line.trim() === "") continue;

        try {
          const data = JSON.parse(line);
          const content = data.choices?.[0]?.delta?.content || "";

          if (fullContent.length + content.length > MAX_CONTENT_SIZE) {
            console.warn(`Content size limit reached for chat ${chatId}`);
            break;
          }
          fullContent += content;
        } catch (e) {
          console.warn(
            "Stream parse error:",
            e instanceof Error ? e.message : String(e),
          );
        }
      }
    }

    if (isAborted()) {
      console.log("Stream aborted, skipping database storage");
      return undefined;
    }

    const newMessage = await createChatMessage(
      userId,
      chatId,
      fullContent,
      Role.assistant,
    );
    return newMessage.id;
  } catch (error) {
    console.error("Error storing stream to database:", error);
    return undefined;
  }
}
