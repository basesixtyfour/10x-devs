import H1 from "@/components/ui/H1";
import ChatInput from "@/components/ChatInput";
import ChatHistory from "@/components/ChatHistory";

export default async function ChatInterface() {
  return (
    <>
      <div className="h-dvh grow w-full dark:bg-background flex flex-col dark:text-white">
        <H1 className="w-fit p-4 sticky top-0">10x Devs</H1>
        <ChatHistory />
        <div className="sticky bottom-0 dark:bg-background ">
          <ChatInput className="text-4xl" />
        </div>
      </div>
    </>
  );
}
