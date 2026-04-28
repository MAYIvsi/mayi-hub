"use client";

import * as React from "react";

function encodeToYinYang(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bits = "";
  for (const b of bytes) {
    bits += b.toString(2).padStart(8, "0");
  }
  return bits.replace(/1/g, "好").replace(/0/g, "不好");
}

function decodeFromYinYang(cipher: string): string {
  const compact = cipher.replace(/\s+/g, "");
  const bitString = compact.replace(/不好/g, "0").replace(/好/g, "1");

  if (!/^[01]*$/.test(bitString) || bitString.length === 0 || bitString.length % 8 !== 0) {
    throw new Error("bad cipher");
  }

  const bytes = new Uint8Array(bitString.length / 8);
  for (let i = 0; i < bitString.length; i += 8) {
    bytes[i / 8] = Number.parseInt(bitString.slice(i, i + 8), 2);
  }

  return new TextDecoder().decode(bytes);
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export function TelegraphClient() {
  const [plainInput, setPlainInput] = React.useState("");
  const [encodedOutput, setEncodedOutput] = React.useState("");

  const [cipherInput, setCipherInput] = React.useState("");
  const [decodedOutput, setDecodedOutput] = React.useState("");

  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<null | "encode" | "decode">(null);

  const onEncode = React.useCallback(() => {
    setError(null);
    setCopied(null);
    setDecodedOutput("");
    setEncodedOutput(encodeToYinYang(plainInput));
  }, [plainInput]);

  const onDecode = React.useCallback(() => {
    setError(null);
    setCopied(null);
    setEncodedOutput("");
    try {
      setDecodedOutput(decodeFromYinYang(cipherInput));
    } catch {
      setError("密文格式错误，这根本不是阴阳文捏！");
      setDecodedOutput("");
    }
  }, [cipherInput]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-xs font-black tracking-[0.28em] text-text-muted">
          BINARY_TELEGRAPH
        </div>
        <h1 className="text-2xl font-black tracking-tight text-text-primary">
          赛博阴阳电报机 (Binary Telegraph)
        </h1>
        <p className="text-sm text-text-muted">
          把秘密编码成“好 / 不好”。懂的都懂。
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-border-pink/40 bg-bg-surface/60 px-4 py-3 text-sm text-accent-pink shadow-[0_0_0_1px_rgba(236,72,153,0.20)]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-bg-surface/50 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm font-black tracking-[0.22em] text-white/80">
              编码区
            </div>
            <div className="text-xs font-black tracking-[0.28em] text-text-muted/80">
              ENCODE
            </div>
          </div>

          <textarea
            value={plainInput}
            onChange={(e) => setPlainInput(e.target.value)}
            placeholder="输入你想加密的秘密..."
            className="h-52 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/85 placeholder:text-white/25 outline-none backdrop-blur focus:border-fuchsia-400/60 focus:shadow-[0_0_0_4px_rgba(236,72,153,0.16)]"
          />

          <button
            type="button"
            onClick={onEncode}
            className="mt-3 w-full rounded-2xl border border-border-pink/60 bg-fuchsia-500/15 px-5 py-4 text-sm font-black tracking-wide text-fuchsia-100 shadow-[0_0_0_1px_rgba(236,72,153,0.18),0_0_28px_rgba(236,72,153,0.18)] transition hover:border-border-pink/80 hover:bg-fuchsia-500/20 hover:shadow-glow-pink"
          >
            🔒 编码为阴阳文
          </button>

          <div className="mt-4">
            <div className="mb-2 text-[10px] font-black tracking-[0.28em] text-white/45">
              输出（好/不好）
            </div>
            <textarea
              readOnly
              value={encodedOutput}
              placeholder="编码结果会出现在这里..."
              className="h-52 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/85 placeholder:text-white/25 outline-none backdrop-blur"
            />
            {encodedOutput ? (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    await copyToClipboard(encodedOutput);
                    setCopied("encode");
                    setTimeout(() => setCopied(null), 900);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/70 hover:border-white/20 hover:bg-white/7.5"
                >
                  📋 一键复制{copied === "encode" ? "（已复制）" : ""}
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-bg-surface/50 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm font-black tracking-[0.22em] text-white/80">
              解码区
            </div>
            <div className="text-xs font-black tracking-[0.28em] text-text-muted/80">
              DECODE
            </div>
          </div>

          <textarea
            value={cipherInput}
            onChange={(e) => setCipherInput(e.target.value)}
            placeholder="粘贴满屏的‘好’与‘不好’..."
            className="h-52 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/85 placeholder:text-white/25 outline-none backdrop-blur focus:border-emerald-400/60 focus:shadow-[0_0_0_4px_rgba(34,197,94,0.16)]"
          />

          <button
            type="button"
            onClick={onDecode}
            className="mt-3 w-full rounded-2xl border border-border-green/60 bg-emerald-500/10 px-5 py-4 text-sm font-black tracking-wide text-emerald-100 shadow-[0_0_0_1px_rgba(34,197,94,0.18),0_0_28px_rgba(34,197,94,0.14)] transition hover:border-border-green/80 hover:bg-emerald-500/15 hover:shadow-glow-green"
          >
            🔓 解码还原真相
          </button>

          <div className="mt-4">
            <div className="mb-2 text-[10px] font-black tracking-[0.28em] text-white/45">
              输出（原文）
            </div>
            <textarea
              readOnly
              value={decodedOutput}
              placeholder="解码结果会出现在这里..."
              className="h-52 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/85 placeholder:text-white/25 outline-none backdrop-blur"
            />
            {decodedOutput ? (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    await copyToClipboard(decodedOutput);
                    setCopied("decode");
                    setTimeout(() => setCopied(null), 900);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white/70 hover:border-white/20 hover:bg-white/7.5"
                >
                  📋 一键复制{copied === "decode" ? "（已复制）" : ""}
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

