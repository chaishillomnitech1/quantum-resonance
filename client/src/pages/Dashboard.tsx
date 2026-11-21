import { Navigation } from "@/components/Navigation";
import { useLayers } from "@/hooks/use-layers";
import { useNodes } from "@/hooks/use-nodes";
import { useSimulations } from "@/hooks/use-simulations";
import { Activity, Radio, Cpu, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

function StatCard({ title, value, icon: Icon, color, subtitle }: any) {
  return (
    <div className="cyber-panel p-6 relative group overflow-hidden">
      <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity ${color}`}>
        <Icon className="w-16 h-16" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2 text-muted-foreground font-mono text-sm uppercase">
          <Icon className="w-4 h-4" />
          {title}
        </div>
        <div className="text-4xl font-display font-bold text-white text-glow mb-1">
          {value}
        </div>
        <p className="text-xs text-muted-foreground font-mono">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: layers } = useLayers();
  const { data: nodes } = useNodes();
  const { data: simulations } = useSimulations();

  const activeLayers = layers?.filter(l => l.status === 'active').length || 0;
  const coherenceAvg = layers?.reduce((acc, l) => acc + (l.coherence || 0), 0) / (layers?.length || 1) || 0;
  
  // Mock data for system coherence chart
  const coherenceData = [
    { time: '00:00', value: 45 },
    { time: '04:00', value: 52 },
    { time: '08:00', value: 38 },
    { time: '12:00', value: 65 },
    { time: '16:00', value: 78 },
    { time: '20:00', value: 72 },
    { time: '24:00', value: 85 },
  ];

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <Navigation />
      
      <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <header className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl md:text-4xl text-white mb-2">System Overview</h1>
          <p className="text-muted-foreground font-mono">
            Dashboard // Real-time Monitoring
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Active Layers" 
            value={activeLayers}
            subtitle={`${layers?.length || 0} Total Detected`}
            icon={Waves}
            color="text-primary"
          />
          <StatCard 
            title="Logic Nodes" 
            value={nodes?.length || 0}
            subtitle="Decision Matrix Size"
            icon={Network}
            color="text-secondary"
          />
          <StatCard 
            title="Sys Coherence" 
            value={`${Math.round(coherenceAvg)}%`}
            subtitle="Resonance Stability"
            icon={Activity}
            color="text-emerald-500"
          />
          <StatCard 
            title="Simulations" 
            value={simulations?.length || 0}
            subtitle="Quantum Events Logged"
            icon={Cpu}
            color="text-accent"
          />
        </div>

        {/* Main Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Coherence Chart */}
          <div className="lg:col-span-2 cyber-panel p-6 bg-black/40 h-[400px]">
            <h3 className="text-lg text-white mb-6 flex items-center gap-2">
              <Activity className="text-primary w-5 h-5" />
              System Coherence History
            </h3>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={coherenceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))" 
                  tick={{fontFamily: 'var(--font-mono)'}}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{fontFamily: 'var(--font-mono)'}}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Alerts/Activity */}
          <div className="cyber-panel p-6 bg-black/40 h-[400px] overflow-hidden flex flex-col">
            <h3 className="text-lg text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="text-accent w-5 h-5" />
              System Log
            </h3>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded bg-white/5 border border-white/5 hover:border-primary/50 transition-colors">
                  <div className="mt-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <div>
                    <p className="text-sm text-white font-mono">Coherence fluctuation detected</p>
                    <p className="text-xs text-muted-foreground mt-1">Sector 7G // 10:4{i} AM</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { Waves, Network } from "lucide-react";
