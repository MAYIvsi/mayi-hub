"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { GlowContainer } from "@/components/ui/GlowContainer";
import { cn } from "@/lib/cn";

function emailPrefix(email: string | null | undefined) {
  if (!email) return "";
  const at = email.indexOf("@");
  return at === -1 ? email : email.slice(0, at);
}

export function LoginClient() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const canSubmit = email.trim().length > 3 && password.length >= 6 && !loading;

  const signIn = async () => {
    setLoading(true);
    setError(null);
    setHint(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  };

  const signUp = async () => {
    setLoading(true);
    setError(null);
    setHint(null);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setHint(
      data.user?.email
        ? `已创建档案：${emailPrefix(data.user.email)}（如果开启邮箱验证，请去收信捏）`
        : "注册请求已发送（如果开启邮箱验证，请去收信捏）",
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <GlowContainer variant="pink" className="p-6">
        <div className="text-xs font-black tracking-[0.28em] text-text-muted">
          ACCESS_GATE
        </div>
        <div className="mt-2 text-2xl font-black tracking-tight text-text-primary">
          探员登录
        </div>
        <div className="mt-1 text-sm text-text-muted">
          未授权访客请勿擅闯机密档案室（
        </div>

        <div className="mt-6 space-y-3">
          <label className="block">
            <div className="mb-1 text-xs font-semibold text-text-muted">
              邮箱
            </div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="agent@mayi-hub.io"
              className={cn(
                "h-11 w-full rounded-xl border border-white/10 bg-bg-app/60 px-3 text-sm text-text-primary outline-none",
                "placeholder:text-text-muted/70 focus:border-accent-pink focus:shadow-glow-pink",
              )}
            />
          </label>

          <label className="block">
            <div className="mb-1 text-xs font-semibold text-text-muted">
              密码
            </div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={cn(
                "h-11 w-full rounded-xl border border-white/10 bg-bg-app/60 px-3 text-sm text-text-primary outline-none",
                "placeholder:text-text-muted/70 focus:border-accent-pink focus:shadow-glow-pink",
              )}
            />
          </label>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-bg-app/50 p-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}
        {hint ? (
          <div className="mt-4 rounded-xl border border-border-green bg-bg-app/50 p-3 text-sm text-accent-green">
            {hint}
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button variant="green" onClick={signIn} disabled={!canSubmit}>
            探员登录
          </Button>
          <Button variant="pink" onClick={signUp} disabled={!canSubmit}>
            注册新档案
          </Button>
        </div>
      </GlowContainer>
    </div>
  );
}

