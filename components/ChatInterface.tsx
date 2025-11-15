import H1 from "@/components/ui/H1";
import ChatInput from "@/components/ChatInput";
import ChatHistory from "@/components/ChatHistory";
import { ProfileButton } from "./ProfileButton";
import { SidebarTrigger } from "./ui/sidebar";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function ChatInterface() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <div className="h-dvh grow w-full dark:bg-background flex flex-col dark:text-white">
        <div className="p-2 gap-4 flex justify-between items-center sticky top-0">
          {session && <SidebarTrigger className="" />}
          <H1 className="w-fit grow">10x Devs</H1>
          <ProfileButton />
        </div>
        <ChatHistory />
        <div className="sticky bottom-0 dark:bg-background ">
          <ChatInput className="text-4xl" />
        </div>
      </div>
    </>
  );
}
