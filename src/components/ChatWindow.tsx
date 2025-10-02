import MessageField from "./MessageField";
import ResponseField from "./ResponseField";
import { ChatMessage } from "@/types";

interface ChatWindowProps {
  chatMessages: ChatMessage[];
}

export default function ChatWindow({ chatMessages }: ChatWindowProps) {
  return (
    <div className="flex flex-col gap-4 overflow-auto pt-24 pb-24 mx-auto mt-2 lg:w-3/5 w-full h-[calc(100vh-4.5rem)] font-sans leading-7 rounded-md bg-[#202020e6] text-inherit">
      {chatMessages.map((chatMessage) => {
        if (chatMessage.role === "user") {
          return (
            <MessageField key={chatMessage.id} message={chatMessage.content} />
          );
        } else if (chatMessage.role === "assistant") {
          return (
            <ResponseField
              key={chatMessage.id}
              content={chatMessage.content}
              className="border-none shadow-none bg-inherit text-inherit"
            />
          );
        } else return null;
      })}
    </div>
  );
}
