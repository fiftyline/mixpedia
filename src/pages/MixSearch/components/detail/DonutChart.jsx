import ReactECharts from "echarts-for-react";

const CHART_COLORS = [
  "#4f80e1",
  "#e15f4f",
  "#4fc98f",
  "#f5a623",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
  "#e74c3c",
  "#3498db",
  "#2ecc71",
];

export default function DonutChart({ data }) {
  const option = {
    tooltip: {
      trigger: "item",
      formatter: (params) =>
        `${params.name}<br/>${params.percent.toFixed(1)}% (${Number(params.value).toLocaleString()}원)`,
    },
    legend: { show: false },
    series: [
      {
        type: "pie",
        radius: ["42%", "70%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: true,
        label: {
          show: true,
          formatter: (params) =>
            `${params.name}\n${params.percent.toFixed(1)}%`,
          fontSize: 11,
          color: "#555",
          lineHeight: 16,
        },
        emphasis: {
          scale: true,
          scaleSize: 6,
        },
        data: data.map((d, i) => ({
          name: d.name,
          value: d.value,
          itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
        })),
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: 240, width: "100%" }}
      opts={{ renderer: "svg" }}
    />
  );
}
