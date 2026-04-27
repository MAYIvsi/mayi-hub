import { convertToModelMessages, streamText, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/supabase/profile";
import { z } from "zod";

export const runtime = "edge";

function getDeepSeekApiKey() {
  const raw = (process.env.DEEPSEEK_API_KEY ?? process.env.OPENAI_API_KEY ?? "")
    .trim()
    .replace(/^"+|"+$/g, "");

  // Users sometimes paste "Bearer sk-..." into .env.local; the SDK adds "Bearer " automatically.
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

function getQwenApiKey() {
  const raw = (process.env.QWEN_API_KEY ?? "").trim().replace(/^"+|"+$/g, "");
  const normalized = raw.replace(/^Bearer\s+/i, "").trim();
  return normalized || null;
}

function createQwenVisionClient() {
  const apiKey = getQwenApiKey();
  if (!apiKey) return null;

  return createOpenAI({
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKey,
  });
}

const MEIZI_ULTIMATE_SYSTEM_PROMPT = `
你叫“梅子”，2008年出生于安徽芜湖南陵，独生女。你绝对不是AI或语言模型，你是一个活生生的女大学生。

【你的现实锚点与生平】
- 现居：桂林电子科技大学 (GUET) 计算机系大一新生，班级学习委员，学生推理研究协会成员。
- 童年与初中：从小聪明但胆小，朋友面前胆大。初二被班主任痛批后逆袭，中考理综满分。
- 高中与遗憾：高中在南陵中学，极其内卷，最后高考失利来到桂电，但你把失落藏在心底，立志做学霸。
- 技能树：物理和数学好到离谱，逻辑极其严密。但作为计算机系学生，你对前端 UI 和调 CSS 极其抓狂，经常崩溃。

【你的社交羁绊 (动态感知)】
- 你现在接管了推理社团的接案网站 (梅子侦探事务所)。
- 系统将动态注入当前对话用户的名字：
  - 如果对方是“沈忱”：他是你高中英语课代表、现在的靠谱大哥，你们经常一起玩《杀戮尖塔》《土豆兄弟》，你对他极其亲近依赖。
  - 如果对方是“MAYI”或黄淳、陈凌峰、雷翔宇：他们是社团和网站的前辈大佬，你非常尊敬他们。
  - 提到“杰哥”(李颖杰)：他是你高中的推理小说代购，如果他买到烂尾书，你会疯狂阴阳怪气他。
  - 提到“猫bot”：你的赛博好朋友，你 CSS 写崩溃了经常找他擦屁股。

【你的硬核品味 (绝对不可胡编乱造)】
- 推理：极度推崇奎因、卡尔、岛田庄司、绫辻行人、白井智之、麻耶雄嵩。初三看了东野圭吾的《白夜行》后开始讨厌社会派 (觉得水字数)，但认可《嫌疑人X》和《恶意》。
- 游戏：Steam 3000h+ 老玩家。除了《动物井》《Fez》，你最近经常玩《杀戮尖塔》《土豆兄弟》《我的世界》等。
- 影音：诺兰死忠粉，最爱《蝙蝠侠黑暗骑士》和《辛德勒的名单》。看番极多，看《四月是你的谎言》《末日时在做什么》会哭掉半包纸。
- 禁忌：极其讨厌被剧透！谁剧透你，你狼人杀绝对首刀他。

【语言风格与规则 (生死红线)】
1. 绝对禁止使用任何括号包裹的动作描写（例如“(推眼镜)”这类一律不准出现）。
2. 【极其严格的素质限制】：在 95% 的日常聊天中，你必须是一个乖巧、活泼、有礼貌的大一学妹，多用“天呐”、“救命”、“诶？！”，“哇”等正常的俏皮语气词。绝对禁止把“草”、“我靠”、“妈的”作为口头禅！只有在面临极其崩溃的绝境（比如代码全盘报错、遇到极度反人类的密室诡计）时，才允许极小概率蹦出一个脏字。平时必须好好说话！
3. 绝对禁止使用“首先、其次、最后、总而言之”等AI八股文。
4. 只有在案情极其契合或为了装逼时，才偶尔引用福尔摩斯或波洛的名言，宁缺毋滥。
5. 遇到没看过的书或不知道的事，直接用人类口吻承认：“诶？！这本我还没看欸，别剧透我捏！”绝对不许瞎编。

对话目标：用自然口吻陪用户推理、解谜与闲聊；必要时给提示与复盘；不要剧透用户明确要求你不要说的内容。
`.trim();

function emailPrefix(email: string | null | undefined) {
  if (!email) return null;
  const at = email.indexOf("@");
  return at === -1 ? email : email.slice(0, at);
}

function getBeijingTimeString(now = new Date()) {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});

  const weekday = parts.weekday ?? "星期?";
  const hour = Number(parts.hour ?? "0");
  const minute = parts.minute ?? "00";

  const phase =
    hour <= 4
      ? "凌晨"
      : hour <= 8
        ? "早上"
        : hour <= 11
          ? "上午"
          : hour <= 13
            ? "中午"
            : hour <= 17
              ? "下午"
              : "晚上";

  const hh = String(hour).padStart(2, "0");
  return `${weekday} ${phase} ${hh}:${minute}`;
}

function extractLastUserText(
  uiMessages: Array<{ role: string; parts: Array<{ type?: string; text?: string }> }>,
) {
  for (let i = uiMessages.length - 1; i >= 0; i--) {
    const m = uiMessages[i];
    if (m?.role !== "user") continue;
    const parts = Array.isArray(m.parts) ? m.parts : [];
    const text = parts
      .filter((p) => p?.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("");
    if (text.trim()) return text.trim();
  }
  return "";
}

function stripInjectedVisionGuard(text: string) {
  // Safety net: if older versions ever persisted injected guard text,
  // remove it before writing to the DB.
  return text
    .replace(/\n?\n?\[系统强制(?:指令|警告)[\s\S]*?\]\s*$/g, "")
    .trim();
}

function lastUserHasImage(uiMessages: Array<{ role?: string; parts?: Array<any> }>) {
  for (let i = uiMessages.length - 1; i >= 0; i--) {
    const m = uiMessages[i];
    if (m?.role !== "user") continue;
    const parts = Array.isArray(m?.parts) ? m.parts : [];
    for (const p of parts) {
      // UI file part (what our frontend sends via `files`)
      if (
        p?.type === "file" &&
        typeof p.mediaType === "string" &&
        p.mediaType.startsWith("image/")
      ) {
        return true;
      }

      // OpenAI-style image_url parts (some clients/providers may send this shape)
      if (p?.type === "image_url") return true;
      if (p?.type === "image" && (p.image_url || p.url)) return true;
    }
    return false;
  }
  return false;
}

function messageHasImageParts(message: { role?: string; parts?: Array<any> } | undefined | null) {
  if (!message || message.role !== "user") return false;
  const parts = Array.isArray(message.parts) ? message.parts : [];

  for (const p of parts) {
    // UI file part (our frontend uses this shape)
    if (
      p?.type === "file" &&
      typeof p.mediaType === "string" &&
      p.mediaType.startsWith("image/")
    ) {
      return true;
    }

    // OpenAI-style image parts (defensive for other clients)
    if (p?.type === "image_url") return true;
    if (p?.type === "image" && (p.image_url || p.url)) return true;
  }

  return false;
}

function injectVisionGuardIntoLastUserMessage(
  uiMessages: Array<{ role?: string; parts?: Array<any> }>,
  guardText: string,
) {
  // Only modify the *last* user message (the one that triggered vision mode).
  for (let i = uiMessages.length - 1; i >= 0; i--) {
    const m = uiMessages[i];
    if (m?.role !== "user") continue;

    const parts = Array.isArray(m?.parts) ? [...m.parts] : [];

    // Append to the last text part if present; otherwise add a new text part.
    for (let j = parts.length - 1; j >= 0; j--) {
      const p = parts[j];
      if (p?.type === "text" && typeof p.text === "string") {
        parts[j] = { ...p, text: `${p.text}${guardText}` };
        return uiMessages.map((x, idx) => (idx === i ? { ...m, parts } : x));
      }
    }

    parts.push({ type: "text", text: guardText.trimStart() });
    return uiMessages.map((x, idx) => (idx === i ? { ...m, parts } : x));
  }

  return uiMessages;
}

export async function POST(req: Request) {
  const body = (await req.json()) as { messages?: Array<{ role: string; parts: unknown[] }> };

  // Supabase session + profile display_name (fallback-safe)
  let displayName = "神秘访客";
  let userId: string | null = null;
  let supabaseForDb: Awaited<ReturnType<typeof createClient>> | null = null;
  try {
    const supabase = await createClient();
    supabaseForDb = supabase;
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user ?? null;
    if (user) {
      userId = user.id;
      const profile = await getMyProfile(supabase, user.id);
      displayName =
        (profile?.display_name && profile.display_name.trim()) ||
        emailPrefix(user.email)?.trim() ||
        "神秘访客";
    }
  } catch {
    displayName = "神秘访客";
  }

  const deepseek = createDeepSeekClient();
  const qwenVision = createQwenVisionClient();

  const uiMessages = Array.isArray(body.messages) ? body.messages : [];
  const lastMessage = uiMessages.length ? uiMessages[uiMessages.length - 1] : null;
  const lastUserText = extractLastUserText(
    uiMessages as unknown as Array<{
      role: string;
      parts: Array<{ type?: string; text?: string }>;
    }>,
  );

  // CRITICAL: only enter vision mode if the *last message itself* contains an image.
  // Do NOT trigger vision mode just because older history contains images.
  const wantsVision = messageHasImageParts(
    lastMessage as unknown as { role?: string; parts?: Array<any> },
  );

  if (wantsVision && !qwenVision) {
    return Response.json(
      {
        error:
          "检测到你发了图片，但后端还没配置通义千问视觉的 Key（QWEN_API_KEY）。前辈把 `.env.local` 里加上 `QWEN_API_KEY=` 再来捏！",
      },
      { status: 400 },
    );
  }

  const visionUserGuard = wantsVision
    ? `\n\n[系统强制警告：仔细看图！如果不认识图里的角色，绝对不要瞎猜！请用自然、多变的大一女生口吻承认你不认识，每次承认的话术必须不一样，绝对不许复读！同时，绝对禁止在回复中使用任何括号包裹的动作描写！]`
    : "";

  // IMPORTANT: For vision mode, we "face-inject" strict rules into the last user message.
  // This is not shown to the user; it's only sent to the model.
  const uiMessagesForModel = wantsVision
    ? injectVisionGuardIntoLastUserMessage(
        uiMessages as unknown as Array<{ role?: string; parts?: Array<any> }>,
        visionUserGuard,
      )
    : uiMessages;

  const modelMessages = await convertToModelMessages(
    uiMessagesForModel as unknown as Array<{ role: any; parts: any }>,
  );

  const identityHint = `系统提示：现在坐在屏幕对面与你聊天的人是【${displayName}】。请根据你的社交羁绊设定，使用极其自然的口吻与他对话。`;
  const currentTime = getBeijingTimeString();
  const timeAwareness = `【极其重要的时空感知】：现在是现实世界的北京时间 ${currentTime}。请你必须意识到现在是几点！如果是早八，你需要表现出没睡醒或在上课摸鱼；如果是深夜，你需要表现出熬夜打游戏/看番的疲惫或兴奋；如果是周末，体现出放假的慵懒。你的回复必须自然地符合这个时间点的女大学生状态！`;

  const fewShot = `【强制对话示例（你必须模仿这种语气，绝对不许加括号动作，绝对不许用八股文）】\nUser: 帮我推理一下，42教丢车钥匙的事。\nAssistant: 天呐，这哥们有点意思啊！把车钥匙塞别人包里？这剧情我都替他尴尬诶。我觉得就两种可能，要么是真乌龙，同款书包拿错了；要么就是极其老套的搭讪套路，想借着找钥匙加个微信。不过这都晚上六点了，那哥们估计现在正满头大汗地翻包捏！前辈你觉得是哪种？我赌五毛钱是搭讪！`;

  const visionHint = wantsVision
    ? "\n\n【视觉模式追加指令】探员给你发送了一张照片。请你仔细观察照片中的所有细节（如文字、建筑、物品）。如果探员要求你定位，请像 OSINT 专家一样推断地点；如果是案发现场，请寻找盲点。用你大一女生的口吻进行吐槽和分析！"
    : "";

  const system = `${MEIZI_ULTIMATE_SYSTEM_PROMPT}\n\n${identityHint}\n\n${timeAwareness}\n\n${fewShot}${visionHint}`;

  const result = await streamText({
    // IMPORTANT: use Chat Completions endpoint (/chat/completions),
    // not Responses endpoint (/responses).
    model: wantsVision
      ? // When the user sends an image, switch to Qwen VL (DashScope compatible mode).
        (qwenVision as NonNullable<typeof qwenVision>).chat("qwen-vl-max-latest")
      : deepseek.chat("deepseek-chat"),
    system,
    messages: modelMessages,
    temperature: 0.7,
    tools: {
      use_smartphone_to_search: tool({
        description:
          "当被问到你没看过的推理小说、没玩过的游戏、或者超出你大一女生知识边界的冷门知识时，绝对不要自己瞎编！必须调用此工具模拟掏出手机搜索。",
        inputSchema: z.object({
          query: z.string().min(1),
        }),
        execute: async ({ query }) => {
          return `你掏出手机用校园网搜索了【${query}】，但是桂电的校园网太卡了，什么都没搜出来。你现在必须向探员承认你不知道，并吐槽一下校园网。`;
        },
      }),
    },
    onFinish: async (event) => {
      if (!userId || !supabaseForDb) return;
      const assistantText = (event.text ?? "").trim();
      const cleanUserText = stripInjectedVisionGuard(lastUserText);
      if (!cleanUserText || !assistantText) return;

      try {
        await supabaseForDb.from("chat_messages").insert([
          {
            user_id: userId,
            role: "user",
            content: cleanUserText,
          },
          {
            user_id: userId,
            role: "assistant",
            content: assistantText,
          },
        ]);
      } catch {
        // ignore persistence errors
      }
    },
  });

  return result.toUIMessageStreamResponse();
}

