import { Card, CardContent } from "@/components/ui/card";

export default function ChatBubbleSkeleton() {
  return (
    <Card className="text-lg dark:bg-chat-bubble-assistant border-none shadow-none">
      <CardContent>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/6" />
          <div className="h-4 bg-muted rounded w-3/6" />
        </div>
      </CardContent>
    </Card>
  );
}
