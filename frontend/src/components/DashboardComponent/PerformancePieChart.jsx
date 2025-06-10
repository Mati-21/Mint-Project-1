import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const data = [
  { name: "average", value: 4.411764705882353 },
  { name: "poor", value: 4.411764705882353 },
  { name: "good", value: 91.17647058823529 },
  { name: "No Data", value: 10 },
];

const COLORS = ["#76dd82", "#4b49ac", "#74c1e9", "#d17d57"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0 ? (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${data[index].name} ${(percent * 100).toFixed(12)}%`}
    </text>
  ) : null;
};

const PerformancePieChart = () => {
  return (
    <div>
      <h3 style={{ textAlign: "left", marginLeft: "20px" }}>
        Performance State for 2024
      </h3>
      <PieChart width={500} height={400}>
        <Pie
          data={data}
          cx={250}
          cy={200}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="#fff"
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PerformancePieChart;
