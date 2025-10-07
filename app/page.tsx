import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return <ChatInterface initialMessages={[]} />;
}
