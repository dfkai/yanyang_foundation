import { cn } from "@/lib/cn";
import { jitter, rand, smoothOpen, wobblyCircle, wobblyPoly, wobblyRect } from "@/lib/hand-drawn";

/**
 * 场景插画
 * ---------------------------------------------------------------------------
 * 影像位在拿到真实照片之前的填充物。用手绘插画而不是图库照片或 AI 生成的
 * 人物影像 —— 这个区分是本质的：插画是**明示的图形**，谁都看得出是画的；
 * 假照片是**伪造的证据**，对公益机构而言性质接近造假。
 *
 * 所以这些插画刻意保持抽象：人只有轮廓没有面孔，房子只有形状没有牌匾。
 * 它们负责撑住版式和氛围，不负责冒充任何真实场景。
 *
 * 上一版这里犯了个低级错误：树冠和太阳用了不规则轮廓，房子却是拿等腰三角形
 * 加正方形拼的，窗户还是标准圆角矩形 —— 同一张图里两套语言在打架。现在
 * 每一个形状都过 lib/hand-drawn，连屋顶的直边都带手抖。
 */

type Kind = "school" | "people" | "hills" | "book";

/** 起伏的地平线 */
function ground(y: number, seed: number) {
  const pts: [number, number][] = Array.from({ length: 7 }, (_, i) => [
    -20 + (i * 440) / 6,
    y + jitter(i, seed) * 7,
  ]);
  return smoothOpen(pts) + ` L420,320 L-20,320 Z`;
}

/** 抽象人形：一个头 + 一段身子，没有面孔 */
function figure(x: number, y: number, s: number, seed: number) {
  return {
    head: wobblyCircle(x, y, 11 * s, { points: 9, amp: 0.08, seed }),
    body: wobblyPoly(
      [
        [x - 13 * s, y + 46 * s],
        [x - 10 * s, y + 16 * s],
        [x, y + 12 * s],
        [x + 10 * s, y + 16 * s],
        [x + 13 * s, y + 46 * s],
      ],
      { amp: 1.8, perEdge: 3, seed: seed + 5 },
    ),
  };
}

const FIGURES = [figure(150, 150, 1.12, 3), figure(212, 162, 0.9, 11), figure(266, 154, 1.02, 19)];

const SCHOOL = {
  wall: wobblyRect(96, 128, 128, 86, { amp: 3.2, perSide: 4, seed: 7 }),
  roof: wobblyPoly(
    [
      [84, 132],
      [160, 82],
      [236, 132],
    ],
    { amp: 3.4, perEdge: 4, seed: 13 },
  ),
  winL: wobblyRect(120, 150, 34, 30, { amp: 1.6, perSide: 2, seed: 23 }),
  winR: wobblyRect(166, 150, 34, 30, { amp: 1.6, perSide: 2, seed: 29 }),
  door: wobblyRect(147, 184, 28, 30, { amp: 1.5, perSide: 2, seed: 37 }),
  crown: wobblyCircle(300, 148, 30, { points: 10, amp: 0.12, seed: 31 }),
  sun: wobblyCircle(342, 62, 20, { points: 9, amp: 0.07, seed: 7 }),
};

const BOOK = {
  pages: `M60,208 C110,186 152,186 197,204 C244,186 286,186 336,208
          L336,148 C286,126 244,126 197,146 C152,126 110,126 60,148 Z`,
  lines: Array.from({ length: 6 }, (_, i) => {
    const left = i % 2 === 0;
    const y = 160 + Math.floor(i / 2) * 15;
    const x = left ? 84 : 214;
    const w = 72 + rand(i, 41) * 26;
    return smoothOpen([
      [x, y],
      [x + w * 0.5, y - 2 + jitter(i, 61) * 2],
      [x + w, y - 3],
    ]);
  }),
};

const SCENES: Record<Kind, React.ReactNode> = {
  school: (
    <>
      <path d={ground(214, 5)} className="fill-(--art-ground)" />
      <path d={SCHOOL.wall} className="fill-(--art-solid)" />
      <path d={SCHOOL.roof} className="fill-(--art-accent)" />
      <path d={SCHOOL.winL} className="fill-(--art-window)" />
      <path d={SCHOOL.winR} className="fill-(--art-window)" />
      <path d={SCHOOL.door} className="fill-(--art-window)" />
      <path
        d={smoothOpen([
          [300, 214],
          [299, 190],
          [301, 168],
        ])}
        stroke="var(--art-solid)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path d={SCHOOL.crown} className="fill-(--art-leaf)" />
      <path d={SCHOOL.sun} className="fill-(--art-sun)" />
    </>
  ),

  people: (
    <>
      <path d={ground(204, 9)} className="fill-(--art-ground)" />
      {FIGURES.map((f, i) => (
        <g key={i} className={i === 1 ? "fill-(--art-accent)" : "fill-(--art-solid)"}>
          <path d={f.body} />
          <path d={f.head} />
        </g>
      ))}
      <path
        d={wobblyCircle(338, 68, 22, { points: 9, amp: 0.07, seed: 13 })}
        className="fill-(--art-sun)"
      />
    </>
  ),

  hills: (
    <>
      <path
        d={
          smoothOpen([
            [-20, 176],
            [70, 118],
            [148, 158],
            [232, 96],
            [320, 150],
            [420, 112],
          ]) + " L420,320 L-20,320 Z"
        }
        className="fill-(--art-solid)"
      />
      <path
        d={
          smoothOpen([
            [-20, 214],
            [88, 182],
            [186, 212],
            [286, 186],
            [420, 210],
          ]) + " L420,320 L-20,320 Z"
        }
        className="fill-(--art-ground)"
      />
      <path
        d={smoothOpen([
          [176, 320],
          [198, 264],
          [176, 232],
          [208, 212],
        ])}
        stroke="var(--art-window)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={wobblyCircle(330, 70, 24, { points: 9, amp: 0.07, seed: 23 })}
        className="fill-(--art-sun)"
      />
    </>
  ),

  book: (
    <>
      <path d={ground(232, 17)} className="fill-(--art-ground)" />
      <path d={BOOK.pages} className="fill-(--art-solid)" />
      <path
        d={smoothOpen([
          [197, 204],
          [196, 176],
          [197, 146],
        ])}
        stroke="var(--art-accent)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {BOOK.lines.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="var(--art-window)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
        />
      ))}
    </>
  ),
};

export function SceneArt({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn("size-full", className)}
    >
      {SCENES[kind]}
    </svg>
  );
}

export type { Kind as SceneKind };
