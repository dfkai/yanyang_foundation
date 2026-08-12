/**
 * 全站共用的手绘滤镜
 * ---------------------------------------------------------------------------
 * 挂在 layout 里，整站只定义一次，各处用 filter: url(#id) 引用。
 *
 * 关键约束：**这些滤镜绝不能直接作用在含文字的元素上**。feDisplacementMap
 * 会把每个像素按噪声位移，文字会一起被揉糊。所以站内的用法一律是给一个
 * 独立的边框图层（伪元素、或单独的 SVG 描边）加滤镜，内容浮在其上不受影响。
 *
 * scale 的取值也有讲究：边框只有 1–2px 粗，位移量超过 5 就会把线条打断成
 * 虚线。纸质毛边用 3.5，撕纸边可以放到 12（那是大块形状，扛得住）。
 */
export function PaperFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {/* 纸质毛边：给卡片/面板的描边用，位移量克制，线条不断 */}
        <filter id="yy-paper-edge" x="-8%" y="-8%" width="116%" height="116%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035 0.048"
            numOctaves="3"
            seed="11"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="3.5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* 撕纸边：区块之间的分隔，大块形状扛得住更大的位移 */}
        <filter id="yy-torn" x="-4%" y="-60%" width="108%" height="220%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.05"
            numOctaves="4"
            seed="17"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="13"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* 蜡笔：图标描边用，位移很小，只求线条有一点抖 */}
        <filter id="yy-crayon" x="-14%" y="-14%" width="128%" height="128%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.09"
            numOctaves="2"
            seed="7"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="1.4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/* 笔刷扫过：给短横线用，让它像一笔画出来的而不是一根尺子量的 */}
        <filter id="yy-stroke" x="-20%" y="-120%" width="140%" height="340%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.06 0.22"
            numOctaves="3"
            seed="29"
            result="n"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="n"
            scale="2.6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * 撕纸边分隔
 * ---------------------------------------------------------------------------
 * 放在两个区块的交界处，把下方区块的底色以不规则的边缘「撕」上来，
 * 替代一条规整的直线。flip 用于让相邻的两处不重复同一条边缘。
 */
export function TornEdge({
  className,
  flip = false,
  height = 34,
}: {
  className?: string;
  flip?: boolean;
  height?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ height, lineHeight: 0 }}
    >
      <svg
        width="100%"
        height={height}
        viewBox="0 0 1440 34"
        preserveAspectRatio="none"
        style={{ display: "block", transform: flip ? "scaleX(-1)" : undefined }}
      >
        <path
          d="M0,34 L0,17 C 180,7 320,25 520,15 C 700,6 820,26 1010,17 C 1180,9 1300,24 1440,14 L1440,34 Z"
          fill="currentColor"
          filter="url(#yy-torn)"
        />
      </svg>
    </div>
  );
}
