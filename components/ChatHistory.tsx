"use client";

import { useChatContext } from "./ChatProvider";
import MessageField from "./MessageField";
import ResponseField from "./ResponseField";

export default function ChatHistory() {
  const { chatMessages } = useChatContext();

  return (
    <div className="grow md:w-3/5 md:mx-auto flex flex-col gap-4">
      {chatMessages.map((m) =>
        m.role === "user" ? (
          <MessageField key={m.id} content={m.content} />
        ) : (
          m.role === "assistant" && (
            <ResponseField
              key={m.id}
              className="text-lg dark:bg-[#202021] dark:text-white border-none shadow-none"
              content={m.content}
            />
          )
        )
      )}
    </div>
  );
}
