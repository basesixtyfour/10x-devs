"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "./ui/input-group";
import { ArrowUpIcon, MessageCircle, Ban, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSendChatMessage } from "@/lib/chat";
import { useChatContext } from "./ChatProvider";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type ModelOption = {
  value: string;
  label: string;
};

const DEFAULT_MODEL_VALUE: ModelOption = {
  value: "google/gemini-2.5-flash-lite",
  label: "Gemini 2.5 Flash Lite",
};
const MODELS: ModelOption[] = [
  { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  { value: "openai/gpt-5.1", label: "GPT-5.1" },
  { value: "x-ai/grok-4.1-fast", label: "Grok 4.1 Fast" },
  { value: "perplexity/sonar-pro-search", label: "Sonar Pro Search" },
];
const STORAGE_KEY = "chat-model-preference";

export default function ChatInput({ className }: { className?: string }) {
  const router = useRouter();
  const {
    message,
    setMessage,
    currentChat: { id: chatId } = {},
    isLoading,
    setIsLoading,
  } = useChatContext();
  const sendChatMessage = useSendChatMessage();
  const controller = useRef(new AbortController());
  const abortSignal = controller.current.signal;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [selectedModel, setSelectedModel] =
    useState<ModelOption>(DEFAULT_MODEL_VALUE);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedModel = localStorage.getItem(STORAGE_KEY);
      if (savedModel) {
        setSelectedModel(
          MODELS.find((m) => m.value === savedModel) || DEFAULT_MODEL_VALUE
        );
      }
    }
  }, []);

  const handleModelChange = (modelValue: string) => {
    const newModel =
      MODELS.find((m) => m.value === modelValue) || DEFAULT_MODEL_VALUE;
    setSelectedModel(newModel);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newModel.value);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    setIsLoading(true);
    sendChatMessage(abortSignal, selectedModel.value)
      .then((newId) => {
        if (!chatId && newId) {
          router.push(`/${newId}`);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCancelMessage = () => {
    controller.current.abort({ name: "Chat Response cancelled" });
    controller.current = new AbortController();
    setIsLoading(false);
  };

  return (
    <InputGroup
      className={cn(
        "md:w-3/5 mx-4 px-4 py-2 md:mx-auto my-4 w-[calc(100%-2rem)] border-none dark:bg-[#2b2b2b] h-auto min-h-9 shrink-0",
        className
      )}
    >
      <InputGroupTextarea
        ref={textareaRef}
        id="chat-input-message"
        className="text-xl md:text-xl flex items-center"
        placeholder="Ask me anything"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <InputGroupAddon className="p-0">
        <MessageCircle className="size-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <InputGroupButton
              variant="outline"
              className="w-fit"
              size="icon-sm"
            >
              <span className="text-sm font-medium">{selectedModel.label}</span>
              <ChevronDown className="size-4" />
              <span className="sr-only">Select model</span>
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuRadioGroup
              value={selectedModel.value}
              onValueChange={handleModelChange}
            >
              {MODELS.map((model) => (
                <DropdownMenuRadioItem key={model.value} value={model.value}>
                  {model.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>

      {isLoading ? (
        <Ban className="animate-spin" onClick={handleCancelMessage} />
      ) : (
        <InputGroupButton
          variant="default"
          className="rounded-full"
          size="icon-sm"
          onClick={handleSendMessage}
        >
          <ArrowUpIcon />
          <span className="sr-only">Send</span>
        </InputGroupButton>
      )}
    </InputGroup>
  );
}
