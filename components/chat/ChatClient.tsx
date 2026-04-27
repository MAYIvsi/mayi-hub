"use client";

import { useChat } from "@ai-sdk/react";
import { useMemo, useState } from "react";

import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatThread } from "@/components/chat/ChatThread";
import { QuickActions } from "@/components/chat/QuickActions";
import { quickActions } from "@/data/chatMock";

export function ChatClient() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  const isLoading = status === "submitted" || status === "streaming";

  const uiMessages = useMemo(() => {
    return messages.map((m) => {
      const parts = (m as unknown as { parts?: Array<{ type: string; text?: string }> })
        .parts;
      const content = Array.isArray(parts)
        ? parts
            .filter((p) => p.type === "text" && typeof p.text === "string")
            .map((p) => p.text)
            .join("")
        : "";

      return {
        id: m.id,
        role: m.role === "assistant" ? ("meizi" as const) : ("user" as const),
        content,
      };
    });
  }, [messages]);

  return (
    <div className="space-y-4">
      <ChatHeader />

      <QuickActions
        actions={quickActions}
        onAction={(a) => {
          if (a.label === "请求提示") setInput("给提示捏!! 但别直接揭底!!");
          if (a.label === "复盘案情") setInput("复盘一下案情线索，用要点写清楚!!");
          if (a.label === "闲聊") setInput("来点轻松的闲聊...别社会派!!（");
        }}
      />

      <div className="rounded-xl border border-white/5 bg-bg-surface/40 p-4">
        <ChatThread messages={uiMessages} showTyping={isLoading} />
      </div>

      <ChatComposer
        input={input}
        onInputChange={(v) => setInput(v)}
        onSubmit={async () => {
          const text = input.trim();
          if (!text) return;
          setInput("");
          await sendMessage({ text });
        }}
        disabled={isLoading}
      />
    </div>
  );
}

