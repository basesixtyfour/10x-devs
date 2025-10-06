import { cn } from "@/lib/utils";

export default function H1({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <h1 className={cn("text-2xl font-bold", className)}>{children}</h1>;
}
