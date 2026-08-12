/**
 * 手绘几何
 * ---------------------------------------------------------------------------
 * 手绘感有两种做法：
 *
 *   A. 画一个规整的圆，再用 SVG 滤镜（feTurbulence + feDisplacementMap）
 *      把它扭歪。写起来快，但滤镜结果虽然是静态的，浏览器却会在滚动时反复
 *      光栅化整块区域 —— 实测把首屏滚动帧率从 64 压到 52，最差帧 82ms。
 *
 *   B. 直接把不规则的路径算出来。零滤镜、零运行时开销、纯矢量任意缩放清晰。
 *
 * 这个文件是 B。所有随机都用确定性哈希，服务端与客户端必须画出同一幅图，
 * 否则 hydration 会对不上。
 */

/** 确定性伪随机，返回 0–1。不能用 Math.random：SSR 与 CSR 必须一致。 */
export function rand(i: number, seed = 1): number {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** 带正负号的扰动，范围 ±1 */
export function jitter(i: number, seed = 1): number {
  return rand(i, seed) * 2 - 1;
}

type Pt = [number, number];

/**
 * 把一串点连成平滑闭合曲线（Catmull-Rom 转三次贝塞尔）。
 * 直接用直线连会得到多边形，看着像低多边形风格而不是手绘。
 */
export function smoothClosed(pts: Pt[]): string {
  const n = pts.length;
  if (n < 3) return "";
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d + "Z";
}

/** 同上，但不闭合 —— 用于地平线、色带这类横贯画面的笔触 */
export function smoothOpen(pts: Pt[]): string {
  const n = pts.length;
  if (n < 3) return "";
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}

/**
 * 手画的圆：半径带低频扰动，节点少一些反而更像一笔画出来的。
 * 节点太多会趋近于完美的圆，手感就没了。
 */
export function wobblyCircle(
  cx: number,
  cy: number,
  r: number,
  {
    points = 13,
    amp = 0.06,
    seed = 1,
  }: { points?: number; amp?: number; seed?: number } = {},
): string {
  const pts: Pt[] = [];
  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2 + jitter(i, seed + 7) * 0.05;
    const rr = r * (1 + jitter(i, seed) * amp);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return smoothClosed(pts);
}

/**
 * 手画的横向笔触带：上沿起伏、下沿平直，读作一道刷过去的颜料。
 * from/to 是这一带的上沿基准高度，画面两端可以不等高。
 */
export function wobblyBand(
  width: number,
  topFrom: number,
  topTo: number,
  bottom: number,
  { segments = 9, amp = 26, seed = 1 }: { segments?: number; amp?: number; seed?: number } = {},
): string {
  const pts: Pt[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = -40 + t * (width + 80);
    const base = topFrom + (topTo - topFrom) * t;
    pts.push([x, base + jitter(i, seed) * amp]);
  }
  const top = smoothOpen(pts);
  return `${top} L${width + 40},${bottom} L-40,${bottom} Z`;
}

/**
 * 手画的矩形：四条边各自采样并扰动，角上刻意不闭合得太准。
 * 用规整的 <rect> 会立刻暴露「这是尺子量的」，和手绘场景打架。
 */
export function wobblyRect(
  x: number,
  y: number,
  w: number,
  h: number,
  { amp = 3, perSide = 3, seed = 1 }: { amp?: number; perSide?: number; seed?: number } = {},
): string {
  const pts: Pt[] = [];
  const push = (px: number, py: number, i: number) =>
    pts.push([px + jitter(i, seed) * amp, py + jitter(i, seed + 31) * amp]);
  let k = 0;
  for (let i = 0; i < perSide; i++) push(x + (w * i) / perSide, y, k++);
  for (let i = 0; i < perSide; i++) push(x + w, y + (h * i) / perSide, k++);
  for (let i = 0; i < perSide; i++) push(x + w - (w * i) / perSide, y + h, k++);
  for (let i = 0; i < perSide; i++) push(x, y + h - (h * i) / perSide, k++);
  return smoothClosed(pts);
}

/**
 * 手画的多边形：给定顶点，在每条边上插值采样并扰动，
 * 这样连屋顶那种直边也会有轻微的手抖。
 */
export function wobblyPoly(
  corners: Pt[],
  { amp = 3, perEdge = 3, seed = 1 }: { amp?: number; perEdge?: number; seed?: number } = {},
): string {
  const pts: Pt[] = [];
  let k = 0;
  for (let c = 0; c < corners.length; c++) {
    const a = corners[c];
    const b = corners[(c + 1) % corners.length];
    for (let i = 0; i < perEdge; i++) {
      const t = i / perEdge;
      pts.push([
        a[0] + (b[0] - a[0]) * t + jitter(k, seed) * amp,
        a[1] + (b[1] - a[1]) * t + jitter(k, seed + 53) * amp,
      ]);
      k++;
    }
  }
  return smoothClosed(pts);
}

/**
 * 儿童画式的光芒：一根从内向外收窄的锥形笔触，两侧微微鼓出，
 * 末端圆润而不是尖的 —— 尖角会读成星形，圆头才像蜡笔画的。
 */
export function ray(
  cx: number,
  cy: number,
  angle: number,
  inner: number,
  outer: number,
  halfWidth: number,
  seed: number,
): string {
  const bow = jitter(seed, 3) * 0.055;
  const p = (r: number, da: number): Pt => [
    cx + Math.cos(angle + da) * r,
    cy + Math.sin(angle + da) * r,
  ];
  const mid = (inner + outer) / 2;
  const pts: Pt[] = [
    p(inner, -halfWidth),
    p(mid, -halfWidth * 0.82 + bow),
    p(outer, -halfWidth * 0.34),
    p(outer + (outer - inner) * 0.04, 0),
    p(outer, halfWidth * 0.34),
    p(mid, halfWidth * 0.82 + bow),
    p(inner, halfWidth),
  ];
  return smoothClosed(pts);
}
