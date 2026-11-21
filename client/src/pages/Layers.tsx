import { Navigation } from "@/components/Navigation";
import { WaveVisualizer } from "@/components/WaveVisualizer";
import { useLayers, useCreateLayer, useUpdateLayer, useDeleteLayer } from "@/hooks/use-layers";
import { useToast } from "@/hooks/use-toast";
import { Plus, Settings2, Trash2, Power } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // shadcn button would be ideal, but assuming generic button usage
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLayerSchema } from "@shared/schema";

// Form Schema
const formSchema = insertLayerSchema.extend({
  frequency: z.coerce.number().min(0).max(100),
  amplitude: z.coerce.number().min(0).max(100),
  phase: z.coerce.number().min(0).max(360),
  coherence: z.coerce.number(),
});

type FormData = z.infer<typeof formSchema>;

function LayerForm({ onSubmit, isPending, initialData }: any) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      frequency: 50,
      amplitude: 50,
      phase: 0,
      status: "active",
      coherence: 100
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-mono text-muted-foreground">Layer Identifier</label>
        <input 
          {...register("name")}
          className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-primary outline-none transition-colors font-mono"
          placeholder="e.g. Alpha Resonance"
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground">Frequency (Hz)</label>
          <input 
            type="number" step="0.1"
            {...register("frequency")}
            className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-primary outline-none transition-colors font-mono"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground">Amplitude</label>
          <input 
            type="number" step="1"
            {...register("amplitude")}
            className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-primary outline-none transition-colors font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground">Phase (Deg)</label>
          <input 
            type="number" step="1"
            {...register("phase")}
            className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-primary outline-none transition-colors font-mono"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground">Status</label>
          <select 
            {...register("status")}
            className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-primary outline-none transition-colors font-mono"
          >
            <option value="active">Active</option>
            <option value="dormant">Dormant</option>
            <option value="unstable">Unstable</option>
          </select>
        </div>
      </div>

      <button 
        disabled={isPending}
        className="w-full neon-button mt-6"
      >
        {isPending ? "INITIALIZING..." : "CONFIRM CONFIGURATION"}
      </button>
    </form>
  );
}

export default function Layers() {
  const { data: layers, isLoading } = useLayers();
  const createLayer = useCreateLayer();
  const updateLayer = useUpdateLayer();
  const deleteLayer = useDeleteLayer();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleCreate = async (data: FormData) => {
    try {
      await createLayer.mutateAsync(data);
      setOpen(false);
      toast({ title: "Layer Initialized", description: "Resonance layer successfully added to matrix." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to create layer", variant: "destructive" });
    }
  };

  // Mock toggle status for demonstration
  const handleToggleStatus = (layer: any) => {
    const newStatus = layer.status === 'active' ? 'dormant' : 'active';
    updateLayer.mutate({ id: layer.id, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <Navigation />
      
      <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl text-white mb-2">Resonance Layers</h1>
            <p className="text-muted-foreground font-mono">
              Configuration // Waveform Matrix
            </p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="neon-button flex items-center gap-2">
                <Plus className="w-4 h-4" /> Initialize Layer
              </button>
            </DialogTrigger>
            <DialogContent className="bg-background/90 border-white/10 backdrop-blur-xl text-white">
              <DialogHeader>
                <DialogTitle className="font-display tracking-widest text-primary">NEW RESONANCE LAYER</DialogTitle>
              </DialogHeader>
              <LayerForm onSubmit={handleCreate} isPending={createLayer.isPending} />
            </DialogContent>
          </Dialog>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {layers?.map((layer) => (
              <div key={layer.id} className="cyber-panel p-0 flex flex-col group hover:border-primary/50 transition-colors duration-300">
                <div className="h-32 bg-black/50 relative overflow-hidden border-b border-white/10">
                  <div className="absolute inset-0 opacity-50">
                    <WaveVisualizer 
                      frequency={layer.frequency} 
                      amplitude={layer.amplitude} 
                      phase={layer.phase} 
                      color={layer.status === 'active' ? '#06b6d4' : '#64748b'}
                    />
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-mono uppercase border ${
                      layer.status === 'active' 
                        ? 'border-primary/50 text-primary bg-primary/10' 
                        : 'border-muted-foreground text-muted-foreground bg-black/40'
                    }`}>
                      {layer.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 bg-gradient-to-b from-transparent to-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl text-white font-display tracking-wide">{layer.name}</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6 text-xs font-mono text-muted-foreground">
                    <div className="bg-black/30 p-2 border border-white/5">
                      <div className="text-white mb-1">{layer.frequency}Hz</div>
                      <div>FREQ</div>
                    </div>
                    <div className="bg-black/30 p-2 border border-white/5">
                      <div className="text-white mb-1">{layer.amplitude}%</div>
                      <div>AMP</div>
                    </div>
                    <div className="bg-black/30 p-2 border border-white/5">
                      <div className="text-white mb-1">{layer.phase}°</div>
                      <div>PHASE</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <button 
                      onClick={() => handleToggleStatus(layer)}
                      className="p-2 rounded hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Toggle Power"
                    >
                      <Power className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2">
                      <button className="p-2 rounded hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                        <Settings2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteLayer.mutate(layer.id)}
                        className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
