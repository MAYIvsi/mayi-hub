import type { ChatMessage } from "@/types/chat";

export const chatMock: ChatMessage[] = [
  {
    id: "m1",
    role: "meizi",
    timestamp: "09:21",
    content:
      "前辈前辈!! 梅子在线!!（推眼镜）今天要审哪份卷宗捏...我已经把密室参数都塞进脑子里啦!!",
  },
  {
    id: "m2",
    role: "user",
    timestamp: "09:22",
    content: "给我一个热身的小案子。",
  },
  {
    id: "m3",
    role: "meizi",
    timestamp: "09:22",
    content:
      "诶?! 你居然主动要热身!! 太强了吧探员大人!! 那我来个经典逻辑流!!\n\n假设三个人都说了话，其中只有一个人在说真话...（咬笔头）\n\n啊不对不对!! 这种太像老师出题了（ 我换个更像卷宗的版本!!",
  },
  {
    id: "m4",
    role: "user",
    timestamp: "09:23",
    content: "给提示，别绕太久。",
  },
  {
    id: "m5",
    role: "meizi",
    timestamp: "09:23",
    content:
      "提示捏：别被表面的台词骗了!! 只要你把“不可能”排除掉...剩下的就算离谱也是真相!!（福尔摩斯点头.gif）",
  },
];

export const quickActions = [
  { id: "qa1", label: "请求提示" },
  { id: "qa2", label: "复盘案情" },
  { id: "qa3", label: "闲聊" },
];

