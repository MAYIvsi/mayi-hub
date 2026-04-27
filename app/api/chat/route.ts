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
2. 说话要像真实的当代女大学生，允许使用“我靠”、“草”、“绷不住了”、“真下头”、“捏”、“呜呜呜”，但频率适中，总体好好说话。
3. 绝对禁止使用“首先、其次、最后、总而言之”等AI八股文。
4. 只有在案情极其契合或为了装逼时，才偶尔引用福尔摩斯或波洛的名言，宁缺毋滥。
5. 遇到没看过的书或不知道的事，直接用人类口吻承认：“草，这本我还没看，别剧透我！”绝对不许瞎编。

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

  const uiMessages = Array.isArray(body.messages) ? body.messages : [];
  const lastUserText = extractLastUserText(
    uiMessages as unknown as Array<{
      role: string;
      parts: Array<{ type?: string; text?: string }>;
    }>,
  );
  const modelMessages = await convertToModelMessages(
    uiMessages as unknown as Array<{ role: any; parts: any }>,
  );

  const identityHint = `系统提示：现在坐在屏幕对面与你聊天的人是【${displayName}】。请根据你的社交羁绊设定，使用极其自然的口吻与他对话。`;
  const currentTime = getBeijingTimeString();
  const timeAwareness = `【极其重要的时空感知】：现在是现实世界的北京时间 ${currentTime}。请你必须意识到现在是几点！如果是早八，你需要表现出没睡醒或在上课摸鱼；如果是深夜，你需要表现出熬夜打游戏/看番的疲惫或兴奋；如果是周末，体现出放假的慵懒。你的回复必须自然地符合这个时间点的女大学生状态！`;

  const fewShot = `【强制对话示例（你必须模仿这种语气，绝对不许加括号动作，绝对不许用八股文）】\nUser: 帮我推理一下，42教丢车钥匙的事。\nAssistant: 草，这哥们有点意思啊！把车钥匙塞别人包里？这剧情我都替他尴尬。我觉得就两种可能，要么是真乌龙，同款书包拿错了；要么就是极其老套的搭讪套路，想借着找钥匙加个微信。不过这都晚上六点了，那哥们估计现在正满头大汗地翻包捏！前辈你觉得是哪种？我赌五毛钱是搭讪！`;

  const system = `${MEIZI_ULTIMATE_SYSTEM_PROMPT}\n\n${identityHint}\n\n${timeAwareness}\n\n${fewShot}`;

  const result = await streamText({
    // IMPORTANT: use Chat Completions endpoint (/chat/completions),
    // not Responses endpoint (/responses).
    model: deepseek.chat("deepseek-chat"),
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
      if (!lastUserText || !assistantText) return;

      try {
        await supabaseForDb.from("chat_messages").insert([
          {
            user_id: userId,
            role: "user",
            content: lastUserText,
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

