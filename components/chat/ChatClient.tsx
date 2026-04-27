"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useMemo, useState } from "react";

import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatThread } from "@/components/chat/ChatThread";
import { QuickActions } from "@/components/chat/QuickActions";
import { quickActions } from "@/data/chatMock";
import { createClient } from "@/lib/supabase/client";

export function ChatClient() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, setMessages } = useChat();
  const [syncing, setSyncing] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setSyncing(true);
      setSyncError(null);
      try {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          if (!cancelled) setMessages([]);
          return;
        }

        const { data, error } = await supabase
          .from("chat_messages")
          .select("id, role, content, created_at")
          .order("created_at", { ascending: true })
          .limit(50);

        if (error) throw error;

        const initial = (data ?? []).map((row) => ({
          id: row.id,
          role: row.role === "assistant" ? ("assistant" as const) : ("user" as const),
          parts: [{ type: "text" as const, text: row.content ?? "" }],
        }));

        if (!cancelled) setMessages(initial);
      } catch (e) {
        if (!cancelled) {
          setSyncError("正在从花江校区服务器同步记忆突触...失败了（");
        }
      } finally {
        if (!cancelled) setSyncing(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [setMessages]);

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
    <div className="flex h-full flex-col overflow-hidden gap-4">
      <ChatHeader />

      <QuickActions
        actions={quickActions}
        onAction={(a) => {
          if (a.label === "请求提示") setInput("给提示捏!! 但别直接揭底!!");
          if (a.label === "复盘案情") setInput("复盘一下案情线索，用要点写清楚!!");
          if (a.label === "闲聊") setInput("来点轻松的闲聊...别社会派!!（");
        }}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/5 bg-bg-surface/40">
        {syncing ? (
          <div className="m-4 rounded-xl border border-border-green bg-bg-app/40 p-4 font-mono text-sm text-accent-green shadow-glow-green">
            正在从花江校区服务器同步记忆突触...
          </div>
        ) : syncError ? (
          <div className="m-4 rounded-xl border border-border-pink bg-bg-app/40 p-4 text-sm text-accent-pink shadow-glow-pink">
            {syncError}
          </div>
        ) : null}

        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <ChatThread messages={uiMessages} showTyping={isLoading} />
        </div>
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

