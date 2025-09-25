import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResponseField from "@/components/ResponseField";

export default function Home() {
  return (
    <div className="flex flex-col w-screen px-64 items-center justify-center h-screen gap-4">
      <div className="flex flex-col w-full items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">10x Devs</h1>
        <p className="text-sm text-gray-500">
          What would you like to build today?
        </p>
      </div>
      <ResponseField />
      <div className="flex flex-row w-full self-end items-center justify-center gap-4 shrink-0">
        <Input className="border-2 border-gray-300 rounded-md" placeholder="Enter your prompt" />
        <Button>Click me</Button>
      </div>
    </div>
  );
}