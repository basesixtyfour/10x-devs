"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResponseField from "@/components/ResponseField";
import { useState } from "react";

export default function Home() {
  const handleClick = () => {
    fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: message })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setResponse(data.choices[0].message);
        setMessage("");
      })
      .catch(error => console.error(error));
  };

  const [response, setResponse] = useState<any>(null);
  const [message, setMessage] = useState<string>("");
  return (
    <div className="dark:bg-[#2d2d30] flex flex-col w-screen px-64 items-center justify-center h-screen gap-4">
      <div className="flex flex-col gap-4 justify-center items-center w-full">
        <h1 className="text-2xl font-bold">10x Devs</h1>
        <p className="text-sm text-gray-500">
          What would you like to build today?
        </p>
      </div>
      {response && <ResponseField response={response} />}
      <div className="flex flex-row gap-4 justify-center items-center self-end w-full shrink-0">
        <Input className="rounded-md border-2 border-gray-300" placeholder="Enter your prompt" value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button onClick={handleClick}>Send</Button>
      </div>
    </div>
  );
}