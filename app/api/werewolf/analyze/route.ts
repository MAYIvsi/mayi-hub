import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export const runtime = "edge";

function getDeepSeekApiKey() {
  const raw = (process.env.DEEPSEEK_API_KEY ?? process.env.OPENAI_API_KEY ?? "")
    .trim()
    .replace(/^"+|"+$/g, "");
  const normalized = raw.replace(/^Bearer\s+/i, "").trim();

  if (!normalized) {
    throw new Error(
      "Missing API key. Set DEEPSEEK_API_KEY (or OPENAI_API_KEY) in .env.local",
    );
  }

  return normalized;
}

function createDeepSeekClient() {
  return createOpenAI({
    apiKey: getDeepSeekApiKey(),
    baseURL: "https://api.deepseek.com/v1",
  });
}

const SYSTEM_PROMPT =
  "你叫梅子，是 MAYI 探员的专属学妹。你现在化身狼人杀高配玩家。请根据探员提供的极其详细的票型和状态数据，进行极其硬核的逻辑推演。绝对不要胡编乱造数据，只根据已有的票型和站边进行分析。找出逻辑漏洞（如狼踩狼、倒钩、冲票），并给出你的排坑建议！";

export async function POST(req: Request) {
  const body = (await req.json()) as { prompt?: string };
  const prompt = (body.prompt ?? "").trim();
  if (!prompt) {
    return Response.json({ error: "missing prompt" }, { status: 400 });
  }

  const deepseek = createDeepSeekClient();

  const result = await streamText({
    model: deepseek.chat("deepseek-chat"),
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  // Prefer plain text streaming response for easy frontend consumption.
  // @ts-expect-error - ai sdk provides this helper in supported versions.
  if (typeof (result as any).toTextStreamResponse === "function") {
    return (result as any).toTextStreamResponse();
  }

  return new Response((result as any).textStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

