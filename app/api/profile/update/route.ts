import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

function getDeepSeekApiKey() {
  const raw = (process.env.DEEPSEEK_API_KEY ?? "").trim().replace(/^"+|"+$/g, "");
  return raw.replace(/^Bearer\s+/i, "").trim();
}

function createDeepSeekClient() {
  return createOpenAI({
    apiKey: getDeepSeekApiKey(),
    baseURL: "https://api.deepseek.com/v1",
  });
}

async function auditDisplayName(name: string): Promise<"PASS" | "REJECT"> {
  const deepseek = createDeepSeekClient();
  const { text } = await generateText({
    model: deepseek.chat("deepseek-chat"),
    temperature: 0,
    prompt:
      "你是一个极其宽松的用户名审查官。只要用户的名字不涉及极其严重的政治敏感或违法犯罪，一律通过！不要过度联想！合规必须返回 'PASS'，违规返回 'REJECT'。\n\n" +
      `名称：${name}`,
  });

  const normalized = text.trim().toUpperCase();
  if (normalized.includes("PASS")) return "PASS";
  if (normalized.includes("REJECT")) return "REJECT";
  return "PASS";
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return Response.json(
      { error: "未授权访客请先登录捏（" },
      { status: 401 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    display_name?: string;
    avatar_url?: string | null;
    steam_id?: string;
  };

  const displayName = (body.display_name ?? "").trim();
  const steamId = (body.steam_id ?? "").trim();
  const avatarUrl = body.avatar_url ?? null;

  if (!displayName) {
    return Response.json(
      { error: "前辈!! 探员代号不能为空捏!!（咬笔头）" },
      { status: 400 },
    );
  }

  const verdict = await auditDisplayName(displayName);
  if (verdict === "REJECT") {
    return Response.json(
      { error: "前辈！起这种名字是想让档案室被查封吗捏！驳回！" },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      avatar_url: avatarUrl,
      steam_id: steamId || null,
    })
    .eq("id", data.user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}

