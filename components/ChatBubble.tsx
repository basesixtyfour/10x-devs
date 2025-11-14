import { Card, CardContent } from "@/components/ui/card";
import MarkDown from "@/components/MarkDown";
import { useChatContext } from "./ChatProvider";
import ChatBubbleSkeleton from "./ChatBubbleSkeleton";

export default function ChatBubble({
  role,
  content,
}: {
  role: "user" | "assistant" | "system";
  content: string;
}) {
  const { isLoading } = useChatContext();
  if (role === "system") {
    return null;
  }
  if (role === "user") {
    return (
      <div className="self-end px-4 mx-4 py-2 rounded-4xl text-lg bg-chat-bubble-user">
        {content}
      </div>
    );
  }

  return isLoading && content.length === 0 ? (
    <ChatBubbleSkeleton />
  ) : (
    <Card className="text-lg dark:bg-chat-bubble-assistant border-none shadow-none">
      <CardContent>
        <MarkDown content={content} />
      </CardContent>
    </Card>
  );
}
