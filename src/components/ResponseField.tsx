import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia as theme } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code(props) {
              const { children, className, node, ref, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  language={match[1]}
                  style={theme}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}
