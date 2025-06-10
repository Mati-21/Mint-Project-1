const clusters = [
  {
    title:
      "Harnessing Digitalisation for Government Services and Commercial Systems",
    color: "fill-sky-300",
    x: 250,
    y: 150,
    items: 5,
  },
  {
    title:
      "Enhancing National R&D Capability for Innovation and Technology Transfer",
    color: "fill-green-300",
    x: 150,
    y: 180,
    items: 5,
  },
  {
    title:
      "Promoting High-Tech Industries for Economic Value-Adding and Diversification",
    color: "fill-orange-300",
    x: 180,
    y: 70,
    items: 2,
    labels: [""],
  },
  {
    title: "Strengthening STI and ICT Regulatory Ecosystem",
    color: "fill-purple-300",
    x: 240,
    y: 260,
    items: 5,
  },
];

const StrategicGoalsDiagram = () => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Strategic Goals and Key Result Areas
      </h2>
      <svg width="500" height="350" className="mb-4">
        {clusters.map((cluster, idx) => (
          <g key={idx}>
            <circle
              cx={cluster.x}
              cy={cluster.y}
              r="50"
              className={`${cluster.color} opacity-60`}
            />
            {[...Array(cluster.items)].map((_, i) => {
              const angle = (2 * Math.PI * i) / cluster.items;
              const cx = cluster.x + Math.cos(angle) * 20;
              const cy = cluster.y + Math.sin(angle) * 20;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="10"
                  className={`${cluster.color} opacity-100`}
                />
              );
            })}
            {cluster.labels?.map((label, i) => (
              <text
                key={i}
                x={cluster.x}
                y={cluster.y + 20 * i}
                textAnchor="middle"
                fontSize="10"
                fill="#000"
              >
                {label}
              </text>
            ))}
          </g>
        ))}
      </svg>

      <div className="space-y-2 text-sm">
        {clusters.map((cluster, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <span
              className={`w-4 h-4 inline-block rounded-full ${cluster.color}`}
            ></span>
            <span>{cluster.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategicGoalsDiagram;
