export type PuzzleDifficulty = "白给级" | "脑洞级" | "逻辑崩坏级";

export type PuzzleType = "海龟汤" | "硬核逻辑" | "图文解密";

export type PuzzleItem = {
  id: string;
  title: string;
  type: PuzzleType;
  difficulty: PuzzleDifficulty;
  content: string;
  correctAnswer: string[];
  meiziRoast: string;
};

export const puzzlesMock: PuzzleItem[] = [
  {
    id: "p1",
    title: "消失的钥匙与反锁门",
    type: "硬核逻辑",
    difficulty: "白给级",
    content:
      "卷宗编号：P1\n\n案发现场：一间单人办公室\n\n现场状况：\n- 门从内侧反锁\n- 室内只有一人\n- 房间里没有第二把钥匙\n\n怪点：门明明是从里面反锁的，但钥匙却不见了。\n\n探员大人，请用一句话说出“钥匙不见”的关键诡计（咬笔头）",
    correctAnswer: ["钥匙在门外", "反锁前把钥匙带走", "钥匙不需要在室内"],
    meiziRoast:
      "前辈你这推理比隔壁二哈还离谱捏!!（摊手）反锁≠钥匙必须留在屋里啊啊啊!!",
  },
  {
    id: "p2",
    title: "馆系列风味的脚印",
    type: "硬核逻辑",
    difficulty: "脑洞级",
    content:
      "卷宗编号：P2\n\n案发现场：雪夜的旧馆外廊\n\n线索：\n- 雪地里只有“一串脚印”，从庭院直通一扇上锁的房门\n- 门内房间空无一人，窗户紧闭\n- 其他方向的雪地无脚印\n\n怪点：脚印到门口就消失了。\n\n请描述“脚印消失”的关键手法（推眼镜）",
    correctAnswer: ["倒着走", "倒退", "脚印是伪造", "脚印覆盖"],
    meiziRoast:
      "诶?! 你居然没想到“倒着走”这种馆系经典套路吗捏!! 前辈要被我记小本本了（",
  },
  {
    id: "p3",
    title: "不可能的电话",
    type: "硬核逻辑",
    difficulty: "脑洞级",
    content:
      "卷宗编号：P3\n\n案发现场：停电的老旧公寓\n\n线索：\n- 断电后，死者手机“接到一通来电”\n- 通话记录里确实存在这通电话\n- 死者当时在黑暗里，没有充电\n\n怪点：停电后怎么还能有来电与记录？\n\n给出你认为最关键的解释方向（别太社会派!!）（咬笔头）",
    correctAnswer: ["并非停电", "基站", "手机有电", "通话记录伪造", "来电显示伪造"],
    meiziRoast:
      "前辈!! 你怎么上来就写“感情纠葛导致误会”啊!!（指指点点）我需要诡计!! 诡计!!",
  },
  {
    id: "p4",
    title: "逻辑崩坏的自白",
    type: "硬核逻辑",
    difficulty: "逻辑崩坏级",
    content:
      "卷宗编号：P4\n\n案发现场：审讯室\n\n证词：\n- A：我没撒谎，但我说的每一句都无法被验证\n- B：A 在撒谎\n- C：B 说的是真的\n\n规则：\n- 每个人只说了一句话\n- 你只能通过逻辑推断“至少一个人”在撒谎\n\n怪点：三句话互相咬死。\n\n请写下你的推理切入点（推眼镜）（麻耶系警报）",
    correctAnswer: ["自指", "悖论", "不可验证", "逻辑循环"],
    meiziRoast:
      "呜呜呜前辈你别硬猜啊捏!! 这是逻辑循环!! 你越猜我越头秃（咬笔头）",
  },
  {
    id: "p5",
    title: "海龟汤：空盘子",
    type: "海龟汤",
    difficulty: "白给级",
    content:
      "卷宗编号：P5\n\n案情：\n一个人点了一碗汤，喝完后看着“空盘子”就哭了。\n\n你可以提出猜测，但这次先给出一个“最可能”的真相关键词。\n\n（咬笔头）前辈你要是写恋爱误会，我会当场把汤扣你头上捏!!",
    correctAnswer: ["人肉", "海难", "误食", "以为", "真相"],
    meiziRoast:
      "前辈你这推理也太松散了捏!! 海龟汤要抓“关键词”啊!! 别写作文!!（",
  },
];

