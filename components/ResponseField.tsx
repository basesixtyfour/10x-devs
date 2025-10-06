import { Card, CardContent } from "@/components/ui/card";
import MarkDown from "@/components/MarkDown";

export default function ResponseField({
  content,
  className,
}: {
  content: string;
  className: string;
}) {
  if (!content) return null;
  return (
    <Card className={className}>
      <CardContent>
        <MarkDown content={content} />
      </CardContent>
    </Card>
  );
}
