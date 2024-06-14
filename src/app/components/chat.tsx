"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

function Message({ message }) {
  return (
    <li
      key={message.id}
      className={`flex ${
        message.role === "user" ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div
        className={`rounded-xl p-4 shadow-md flex w-3/4 ${
          message.role === "user" ? "bg-blue-200" : "bg-orange-200"
        }`}
      >
        <p className="text-primary">{message.content}</p>
      </div>
    </li>
  );
}

export function Chat() {
  const [route, setRoute] = useState("api/ex2");
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: route,
    onError: (e) => {
      console.log(e);
    },
  });
  const chatParent = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  });

  return (
    <main className="flex flex-col w-full h-screen max-h-dvh">
      <header className="p-4 border-b w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Demo App</h1>
      </header>

      <section className="p-4">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-3xl mx-auto items-center"
        >
          <Textarea
            placeholder="Type your message here."
            className="flex-1 min-h-[40px]"
            value={input}
            onChange={handleInputChange}
          />
          <Button className="ml-2" type="submit">
            Submit
          </Button>
        </form>
      </section>

      <section className="p-4">
        <Select onValueChange={(value) => setRoute(value)} value={route}>
          <SelectTrigger className="w-full max-w-3xl mx-auto">
            <SelectValue placeholder="Select Route" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Routes</SelectLabel>
              <SelectItem value="api/ex1">Just Chat Without History</SelectItem>
              <SelectItem value="api/ex3">Chat with a History</SelectItem>
              <SelectItem value="api/ex2">Chat with A Prompt</SelectItem>
              <SelectItem value="api/ex4">Chat with RAG (Our Own Data)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </section>

      <section className="container px-0 pb-10 flex flex-col flex-grow gap-4 mx-auto max-w-3xl bg-white">
        <ul
          ref={chatParent}
          className="h-1 p-4 flex-grow bg-muted/50 rounded-lg overflow-y-auto flex flex-col gap-4"
        >
          {messages.map((m, index) => (
            <Message key={index} message={m} />
          ))}
        </ul>
      </section>
    </main>
  );
}
