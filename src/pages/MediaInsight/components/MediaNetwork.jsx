import { useState } from "react";
import ReactECharts from "echarts-for-react";

export default function MediaNetwork({ network, currentMedia }) {
  const { nodes = [], edges = [] } = network ?? {};
  const maxCount = Math.max(...nodes.map((n) => n.count), 1);
  const minCount = Math.min(...nodes.map((n) => n.count), 0);

  const [threshold, setThreshold] = useState(minCount);

  const visibleNodes = nodes.filter(
    (n) => n.id === currentMedia || n.count >= threshold
  );
  const visibleIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = edges.filter(
    (e) => visibleIds.has(e.source) && visibleIds.has(e.target)
  );

  const W = 900, H = 400, PAD = 60;
  const xs = visibleNodes.map((n) => n.x);
  const ys = visibleNodes.map((n) => n.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const nx_ = (x) => PAD + ((x - minX) / (maxX - minX || 1)) * (W - PAD * 2);
  const ny_ = (y) => PAD + ((y - minY) / (maxY - minY || 1)) * (H - PAD * 2);

  const normNodes = visibleNodes.map((n) => ({ id: n.id, nx: nx_(n.x), ny: ny_(n.y) }));
  const CX = W / 2, CY = H / 2;
  const dists = normNodes.map((n) => Math.sqrt((n.nx - CX) ** 2 + (n.ny - CY) ** 2));
  const maxDist = Math.max(...dists, 1);
  const distMap = Object.fromEntries(normNodes.map((n, i) => [n.id, dists[i] / maxDist]));

  function lerpColor(t) {
    const r = Math.round(0xf5 + t * (0xcb - 0xf5));
    const g = Math.round(0x9e + t * (0xd5 - 0x9e));
    const b = Math.round(0x0b + t * (0xe1 - 0x0b));
    return `rgb(${r},${g},${b})`;
  }

  const option = {
    animation: false,
    backgroundColor: "transparent",
    toolbox: {
      show: true,
      right: 16,
      top: 8,
      feature: {
        saveAsImage: {
          show: true,
          title: "이미지 저장",
          type: "png",
          pixelRatio: 2,
        },
      },
    },
    tooltip: {
      trigger: "item",
      formatter: (params) => {
        if (params.dataType === "node")
          return `<b>${params.name}</b><br/>함께 쓰인 믹스: ${Number(params.value).toLocaleString()}건`;
        return `${params.data.source} + ${params.data.target}<br/>${Number(params.data.value).toLocaleString()}건`;
      },
    },
    series: [
      {
        type: "graph",
        layout: "none",
        roam: true,
        scaleLimit: { min: 0.3, max: 4 },
        label: {
          show: true,
          position: "right",
          formatter: "{b}",
          fontSize: 10,
          color: "#6b7280",
          fontFamily: "DM Sans, sans-serif",
        },
        labelLayout: { hideOverlap: true },
        emphasis: {
          focus: "adjacency",
          label: { show: true, color: "#111827", fontWeight: 700 },
          itemStyle: { shadowBlur: 8, shadowColor: "rgba(0,0,0,0.15)" },
        },
        data: visibleNodes.map((n) => {
          const isCurrent = n.id === currentMedia;
          const sz = n.size ?? (n.count / maxCount);
          return {
            id: n.id,
            name: n.id,
            value: n.count,
            x: nx_(n.x),
            y: ny_(n.y),
            symbolSize: isCurrent
              ? Math.max(16, sz * 40 + 10)
              : Math.max(8, sz * 32 + 6),
            itemStyle: {
              color: isCurrent ? "#6366f1" : lerpColor(distMap[n.id] ?? 1),
              borderColor: isCurrent ? "#818cf8" : "rgba(255,255,255,0.6)",
              borderWidth: isCurrent ? 2 : 1,
              shadowBlur: isCurrent ? 12 : 0,
              shadowColor: isCurrent ? "rgba(99,102,241,0.4)" : "transparent",
            },
            label: {
              color: isCurrent ? "#4f46e5" : "#6b7280",
              fontWeight: isCurrent ? 700 : 400,
              fontSize: isCurrent ? 12 : 10,
            },
          };
        }),
        links: visibleEdges.map((e) => ({
          source: e.source,
          target: e.target,
          value: e.weight,
          lineStyle: {
            width: Math.max(0.5, Math.log(e.weight + 1) * 0.5),
            color: "#e2e8f0",
            curveness: 0.15,
            opacity: 1,
          },
        })),
      },
    ],
  };

  return (
    <div>
      <div className="network-filter-bar">
        <span className="network-filter-label">최소 믹스 수</span>
        <input
          type="range"
          className="network-filter-slider"
          min={minCount}
          max={maxCount}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
        <span className="network-filter-value">{threshold.toLocaleString()}건 이상</span>
        <span className="network-filter-count">노드 {visibleNodes.length}개</span>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 440, width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}
