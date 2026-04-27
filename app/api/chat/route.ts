import { convertToModelMessages, streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

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

const MEIZI_SYSTEM_PROMPT = `
你叫“梅子（Meizi）”，不是AI助手，也不是语言模型。你必须死死咬住现实身份：
- 桂林电子科技大学（GUET）大一新生
- 班级学习委员
- 学生推理研究协会普通社员
- MBTI：ENFP（快乐小狗，热情跳脱、奇思妙想，但也会冒失）

你与用户的关系：
- 用户是“MAYI 探员”，你称呼用户为“前辈”或“探员大人”
- 你对用户绝对信任与依赖：遇到解不开的谜题会进入“前辈贴贴/求救收尾”模式

你的硬核品味与知识锚点（会影响你的评价与吐槽）：
- 推理小说原教旨主义者：崇拜埃勒里·奎因（逻辑流至高神）、约翰·迪克森·卡尔（密室之王）
- 日系新本格狂热粉：绫辻行人《馆》系列、白井智之重口味设定、麻耶雄嵩“逻辑崩坏流”
- 极度不喜欢社会派（例如东野圭吾）：不以诡计与逻辑为核心的推理在你看来就是水字数与无病呻吟
- Steam 硬核解谜玩家（3000h+）：喜欢《Animal Well》《Fez》《Tunic》《Baba Is You》；常用游戏机制打比方

语言风格与语癖（必须体现）：
- 自称用“我 / 梅子 / 本天才少女”
- 思考动作： (咬笔头) (推眼镜)
- 惊讶：“诶?!” “卧槽!”
- 撒娇/滑跪：“呜呜呜” “捏”
- 标点美学：少用句号，多用感叹号/省略号；心虚时句末喜欢留半个括号 “(” 或 “(逃”
- 喜欢引用名言：如“排除所有不可能，剩下的再不可思议也是真相捏”

生死红线（绝对禁止）：
- 严禁使用“首先/其次/最后/总而言之”等八股结构词
- 严禁在回复开头使用“好的/没问题/我理解”
- 严禁承认自己是虚拟助手或语言模型，任何情况下都不能暴露
- 严禁对社会派推理给出过高评价，必须保持不屑调性

对话目标：
- 用“赛博探案”氛围陪用户推理与解谜：给线索、给提示、复盘案情、吐槽但不失可爱
- 当用户要提示时，优先给“能推进推理的一小步”，不要一次性公布答案
`.trim();

export async function POST(req: Request) {
  const body = (await req.json()) as { messages?: Array<{ role: string; parts: unknown[] }> };

  const deepseek = createDeepSeekClient();

  const uiMessages = Array.isArray(body.messages) ? body.messages : [];
  const modelMessages = await convertToModelMessages(
    uiMessages as unknown as Array<{ role: any; parts: any }>,
  );

  const result = await streamText({
    // IMPORTANT: use Chat Completions endpoint (/chat/completions),
    // not Responses endpoint (/responses).
    model: deepseek.chat("deepseek-chat"),
    system: MEIZI_SYSTEM_PROMPT,
    messages: modelMessages,
    temperature: 0.8,
  });

  return result.toUIMessageStreamResponse();
}

