import { Navigation } from "@/components/Navigation";
import { useSimulations, useCreateSimulation } from "@/hooks/use-simulations";
import { useToast } from "@/hooks/use-toast";
import { Play, Terminal, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Simulations() {
  const { data: simulations, isLoading } = useSimulations();
  const createSimulation = useCreateSimulation();
  const { toast } = useToast();
  const [logs, setLogs] = useState<string[]>([]);

  // Simulation effect
  useEffect(() => {
    if (createSimulation.isPending) {
      const interval = setInterval(() => {
        const msgs = [
          "Calibrating quantum flux...",
          "Checking coherence stability...",
          "Calculating probability vectors...",
          "Collapsing wave functions...",
          "Analyzing outcome variance..."
        ];
        const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        setLogs(prev => [`[${timestamp}] ${randomMsg}`, ...prev].slice(0, 20));
      }, 800);
      return () => clearInterval(interval);
    }
  }, [createSimulation.isPending]);

  const handleRunSimulation = async () => {
    try {
      setLogs(prev => [`[${new Date().toISOString().split('T')[1].split('.')[0]}] INITIALIZING NEW SIMULATION...`, ...prev]);
      
      await createSimulation.mutateAsync({
        parameters: { intensity: "high", cycles: 1000 },
        status: "completed",
        resultScore: Math.random() * 100
      });
      
      setLogs(prev => [`[${new Date().toISOString().split('T')[1].split('.')[0]}] SIMULATION COMPLETE. SUCCESS.`, ...prev]);
      toast({ title: "Simulation Complete", description: "Results have been logged to the quantum registry." });
    } catch (err) {
      toast({ title: "Error", description: "Simulation failed to execute", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <Navigation />
      
      <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <header className="border-b border-white/10 pb-6">
          <h1 className="text-3xl md:text-4xl text-white mb-2">Quantum Simulations</h1>
          <p className="text-muted-foreground font-mono">
            Experimental // Outcome Analysis
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="cyber-panel p-6 bg-black/40">
              <h3 className="text-white font-display mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-accent" /> Control Deck
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="bg-black/40 p-3 border border-white/10 rounded">
                  <label className="text-xs text-muted-foreground font-mono block mb-1">INTENSITY CYCLE</label>
                  <div className="h-2 bg-gray-800 rounded overflow-hidden">
                    <div className="h-full w-[75%] bg-accent animate-pulse" />
                  </div>
                </div>
                
                <div className="bg-black/40 p-3 border border-white/10 rounded">
                  <label className="text-xs text-muted-foreground font-mono block mb-1">COHERENCE LOCK</label>
                  <div className="text-green-500 font-mono text-sm flex items-center gap-2">
                    <CheckCircle2 size={14} /> ENGAGED
                  </div>
                </div>
              </div>

              <button 
                onClick={handleRunSimulation}
                disabled={createSimulation.isPending}
                className="w-full neon-button border-accent text-accent hover:shadow-[0_0_20px_hsl(var(--accent)/0.6)]"
              >
                {createSimulation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" /> PROCESSING
                  </span>
                ) : (
                  "INITIATE SIMULATION"
                )}
              </button>
            </div>

            {/* Terminal Log */}
            <div className="cyber-panel p-4 bg-black font-mono text-xs h-[300px] flex flex-col">
              <div className="flex items-center gap-2 text-muted-foreground border-b border-white/10 pb-2 mb-2">
                <Terminal size={14} /> SYS.LOG
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                {logs.length === 0 && <span className="text-muted-foreground opacity-50">Waiting for input...</span>}
                {logs.map((log, i) => (
                  <div key={i} className="text-green-400/80">
                    <span className="text-accent/50 mr-2">{'>'}</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-2 cyber-panel p-6 bg-black/20">
            <h3 className="text-white font-display mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Recent Simulations
            </h3>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-white/5 animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {simulations?.slice().reverse().map((sim) => (
                  <div key={sim.id} className="bg-black/40 border border-white/5 p-4 rounded hover:border-primary/30 transition-colors flex items-center justify-between group">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-primary font-mono font-bold">SIM-{sim.id.toString().padStart(4, '0')}</span>
                        <span className={cn(
                          "text-[10px] uppercase px-1.5 py-0.5 rounded border",
                          sim.status === 'completed' ? "border-green-500/50 text-green-500 bg-green-500/10" : 
                          sim.status === 'collapsed' ? "border-red-500/50 text-red-500 bg-red-500/10" :
                          "border-blue-500/50 text-blue-500 bg-blue-500/10"
                        )}>
                          {sim.status}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {new Date(sim.timestamp!).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-mono text-muted-foreground mb-1">SCORE</div>
                      <div className="text-2xl font-bold text-white font-display">
                        {sim.resultScore ? sim.resultScore.toFixed(1) : '--'}
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!simulations || simulations.length === 0) && (
                  <div className="text-center text-muted-foreground py-12 font-mono">
                    NO SIMULATION DATA FOUND
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
