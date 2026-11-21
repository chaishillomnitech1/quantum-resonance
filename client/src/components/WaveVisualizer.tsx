import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";

interface WaveVisualizerProps {
  frequency: number;
  amplitude: number;
  phase: number;
  color?: string;
}

export function WaveVisualizer({ frequency, amplitude, phase, color = "#06b6d4" }: WaveVisualizerProps) {
  const data = useMemo(() => {
    const points = [];
    // Generate 100 points for one second
    for (let t = 0; t <= 100; t++) {
      const time = t / 100;
      // Basic wave physics: y = A * sin(2 * PI * f * t + phase)
      const value = amplitude * Math.sin(2 * Math.PI * frequency * time + phase);
      points.push({ time, value });
    }
    return points;
  }, [frequency, amplitude, phase]);

  return (
    <div className="w-full h-full min-h-[150px] cyber-panel p-4 bg-black/50">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={[-100, 100]} hide />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
