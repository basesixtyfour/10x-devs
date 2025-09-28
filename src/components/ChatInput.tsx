"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: () => void;
}

export default function ChatInput({
  message,
  setMessage,
  sendMessage,
}: ChatInputProps) {
  return (
    <div className="fixed bottom-0 w-full shrink-0 ">
      <div className="w-2/3 flex gap-4 items-center justify-end rounded-4xl px-3 py-2 mx-auto dark:bg-[#303030] mb-4">
        <Input
          className="text-lg border-none dark:text-lg placeholder:text-gray-500 bg-inherit dark:bg-inherit dark:placeholder:text-grey-400"
          type="text"
          placeholder="Enter your prompt"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage} className="w-10 h-10 rounded-full">
          <SendHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}
