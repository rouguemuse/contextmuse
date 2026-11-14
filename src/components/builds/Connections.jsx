import React from 'react';

export default function Connections({ pieces, links }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width="100%"
      height="100%"
      viewBox="0 0 2400 1700"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        {/* Directional Arrow Marker */}
        <marker
          id="workflow-arrow"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#17504A" />
        </marker>
        <marker
          id="workflow-arrow-bottleneck"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#DC2626" />
        </marker>
      </defs>

      {links.map((link) => {
        const a = pieces.find((p) => p.id === link.from);
        const b = pieces.find((p) => p.id === link.to);
        if (!a || !b) return null;

        const isBottleneck = b.stepState === 'bottleneck' || a.stepState === 'bottleneck';

        // Calculate connection coordinates
        // If 'a' is to the left of 'b', connect right edge of 'a' to left edge of 'b'
        let x1, y1, x2, y2;
        if (a.x + a.w <= b.x) {
          x1 = a.x + a.w;
          y1 = a.y + (a.collapsed ? 21 : a.h / 2);
          x2 = b.x;
          y2 = b.y + (b.collapsed ? 21 : b.h / 2);
        } else if (b.x + b.w <= a.x) {
          x1 = a.x;
          y1 = a.y + (a.collapsed ? 21 : a.h / 2);
          x2 = b.x + b.w;
          y2 = b.y + (b.collapsed ? 21 : b.h / 2);
        } else {
          // Vertical layout
          x1 = a.x + a.w / 2;
          y1 = a.y + (a.collapsed ? 42 : a.h);
          x2 = b.x + b.w / 2;
          y2 = b.y;
        }

        const mx = x1 + (x2 - x1) / 2;

        return (
          <g key={link.id}>
            <path
              d={`M ${x1} ${y1} H ${mx} V ${y2} H ${x2}`}
              fill="none"
              stroke={isBottleneck ? '#DC2626' : '#17504A'}
              strokeWidth={isBottleneck ? '2.5' : '2'}
              strokeDasharray={isBottleneck ? '4 3' : 'none'}
              strokeOpacity={isBottleneck ? '0.85' : '0.65'}
              markerEnd={isBottleneck ? 'url(#workflow-arrow-bottleneck)' : 'url(#workflow-arrow)'}
            />
            <circle cx={x1} cy={y1} r="3.5" fill={isBottleneck ? '#DC2626' : '#17504A'} />
            <circle cx={x2} cy={y2} r="3.5" fill={isBottleneck ? '#DC2626' : '#17504A'} />
          </g>
        );
      })}
    </svg>
  );
}
