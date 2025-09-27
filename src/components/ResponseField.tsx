import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ResponseField({ content }: { content: string }) {
  return (
    <Card className="rounded-md dark:bg-[#2d2d30] text-white border-2 border-gray-300 shrink-0">
      <CardContent>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </CardContent>
    </Card>
  );
}