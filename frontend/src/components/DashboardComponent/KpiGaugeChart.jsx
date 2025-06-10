import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const getColor = (value) => {
  if (value < 30) return "#DF5353";
  if (value < 70) return "#DDDF0D";
  return "#55BF3B";
};

const TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const KpiGaugeChart = ({ value = 53.577 }) => {
  const clamped = Math.max(0, Math.min(100, value));
  const angleDeg = (clamped / 100) * 180;

  const gaugeData = Array.from({ length: 10 }, (_, i) => ({
    value: 10,
    color: getColor(i * 10 + 5),
  }));

  const getNeedlePath = () => {
    const centerX = 200;
    const centerY = 130;
    const r = 80;
    const baseWidth = 5; // Reduced thickness from 10 to 5

    const theta = (Math.PI * (180 - angleDeg)) / 180;
    const tipX = centerX + r * Math.cos(theta);
    const tipY = centerY - r * Math.sin(theta);

    const leftX = centerX + baseWidth * Math.cos(theta + Math.PI / 2);
    const leftY = centerY - baseWidth * Math.sin(theta + Math.PI / 2);

    const rightX = centerX + baseWidth * Math.cos(theta - Math.PI / 2);
    const rightY = centerY - baseWidth * Math.sin(theta - Math.PI / 2);

    return `M ${leftX} ${leftY} L ${tipX} ${tipY} L ${rightX} ${rightY} Z`;
  };

  const renderTicks = () => {
    const radius = 120; // Increased spacing from arc
    const centerX = 200;
    const centerY = 130;

    return TICKS.map((tick) => {
      const tickAngle = 180 - (tick / 100) * 180;
      const rad = (Math.PI * tickAngle) / 180;
      const x = centerX + radius * Math.cos(rad);
      const y = centerY - radius * Math.sin(rad);

      return (
        <text
          key={tick}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
          fill="#333"
        >
          {tick}
        </text>
      );
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-6">Avg KPI scoreCard</h2>
      <ResponsiveContainer width={400} height={250}>
        <PieChart>
          <Pie
            data={gaugeData}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={100}
            paddingAngle={2}
            stroke="none"
          >
            {gaugeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          {/* Custom Needle */}
          <svg>
            <path d={getNeedlePath()} fill="#444" />
          </svg>

          {/* Tick Numbers */}
          {renderTicks()}
        </PieChart>
      </ResponsiveContainer>

      <p className="text-lg font-bold mt-[-10px]">{clamped.toFixed(2)} %</p>
    </div>
  );
};

export default KpiGaugeChart;
