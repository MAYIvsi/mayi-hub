export const dashboardData = {
  agentCodename: "MAYI",
  welcomeHeadline: "WELCOME BACK, MAYI",
  welcomeSubline:
    "探员大人快快快!! 我把卷宗都摆好了捏...（咬笔头）今天也要狠狠干爆逻辑诡计!!",
  stats: [
    {
      key: "casesSolved",
      label: "已破解案件",
      value: 7,
      unit: "件",
      progress: 35,
      accent: "green" as const,
    },
    {
      key: "logicRating",
      label: "逻辑评级",
      value: "B+",
      unit: "",
      progress: 68,
      accent: "pink" as const,
    },
    {
      key: "activeDays",
      label: "活跃天数",
      value: 12,
      unit: "天",
      progress: 48,
      accent: "green" as const,
    },
    {
      key: "steamHours",
      label: "Steam 摸鱼时长",
      value: 1337,
      unit: "h",
      progress: 91,
      accent: "pink" as const,
    },
  ],
  notices: [
    {
      title: "系统提示：卷宗已解锁",
      body: "机密档案模块已上线静态版本，hover 发光会让人上头捏。",
      tag: "UPDATE",
    },
    {
      title: "梅子碎碎念：社会派警告（",
      body: "前辈要是把“情感纠葛”当作推理主菜...我会当场掀桌捏!!",
      tag: "MEIZI",
    },
  ],
};

