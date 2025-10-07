import { useChatContext } from "./ChatProvider";
import MessageField from "./MessageField";
import ResponseField from "./ResponseField";

export default function ChatHistory({ className }: { className?: string }) {
  const { chatMessages } = useChatContext();
  return (
    <div className={className}>
      {chatMessages.map((m) =>
        m.role === "user" ? (
          <MessageField key={m.id} content={m.content} />
        ) : (
          <ResponseField
            key={m.id}
            className="text-lg dark:bg-[#202021] dark:text-white border-none shadow-none"
            content={m.content}
          />
        )
      )}
    </div>
  );
}
