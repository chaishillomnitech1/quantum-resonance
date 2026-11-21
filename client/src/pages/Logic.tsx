import { Navigation } from "@/components/Navigation";
import { useNodes, useCreateNode, useDeleteNode } from "@/hooks/use-nodes";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, GitBranch, GitCommit, GitMerge, Network } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNodeSchema, type DecisionNode } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = insertNodeSchema.extend({
  probability: z.coerce.number().min(0).max(1),
  parentId: z.coerce.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

function NodeForm({ onSubmit, isPending, parentId }: any) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "branch",
      probability: 1.0,
      parentId: parentId || undefined
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-mono text-muted-foreground">Node Label</label>
        <input 
          {...register("label")}
          className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-primary outline-none transition-colors font-mono"
          placeholder="Decision point description"
        />
        {errors.label && <p className="text-red-500 text-xs">{errors.label.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground">Type</label>
          <select 
            {...register("type")}
            className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-primary outline-none transition-colors font-mono"
          >
            <option value="root">Root Node</option>
            <option value="branch">Branch</option>
            <option value="leaf">Leaf</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-mono text-muted-foreground">Probability (0-1)</label>
          <input 
            type="number" step="0.1"
            {...register("probability")}
            className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-primary outline-none transition-colors font-mono"
          />
        </div>
      </div>
      
      {/* Hidden Parent ID */}
      <input type="hidden" {...register("parentId")} />

      <button 
        disabled={isPending}
        className="w-full neon-button mt-6"
      >
        {isPending ? "COMPUTING..." : "ADD LOGIC NODE"}
      </button>
    </form>
  );
}

const TreeNode = ({ node, allNodes, onDelete, onAddChild }: { node: DecisionNode, allNodes: DecisionNode[], onDelete: (id: number) => void, onAddChild: (parentId: number) => void }) => {
  const children = allNodes.filter(n => n.parentId === node.id);
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="ml-6 relative">
      {/* Connector Line */}
      <div className="absolute -left-4 top-4 w-4 h-[1px] bg-white/10" />
      {/* Vertical Line for children */}
      {children.length > 0 && expanded && (
        <div className="absolute left-3 top-8 bottom-0 w-[1px] bg-white/10" />
      )}

      <div className="group flex items-center gap-3 mb-2">
        {/* Node Icon */}
        <div 
          onClick={() => setExpanded(!expanded)}
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer transition-all duration-300 z-10
            ${node.type === 'root' ? 'bg-primary/20 border-primary text-primary' : 
              node.type === 'leaf' ? 'bg-accent/20 border-accent text-accent' : 
              'bg-white/5 border-white/20 text-white hover:border-white/50'}
          `}
        >
          {node.type === 'root' ? <GitCommit size={16} /> : 
           node.type === 'leaf' ? <GitMerge size={16} /> : 
           <GitBranch size={16} />}
        </div>

        {/* Node Content */}
        <div className="flex-1 cyber-panel p-3 flex items-center justify-between gap-4 bg-black/40 hover:bg-white/5 transition-colors">
          <div>
            <div className="text-sm font-mono text-white font-bold">{node.label}</div>
            <div className="text-xs text-muted-foreground font-mono">
              P: {node.probability} // TYPE: {node.type.toUpperCase()}
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onAddChild(node.id)}
              className="p-1.5 hover:bg-primary/20 hover:text-primary rounded transition-colors"
              title="Add Branch"
            >
              <Plus size={14} />
            </button>
            <button 
              onClick={() => onDelete(node.id)}
              className="p-1.5 hover:bg-destructive/20 hover:text-destructive rounded transition-colors"
              title="Delete Node"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Children */}
      <AnimatePresence>
        {expanded && children.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {children.map(child => (
              <TreeNode 
                key={child.id} 
                node={child} 
                allNodes={allNodes}
                onDelete={onDelete}
                onAddChild={onAddChild}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Logic() {
  const { data: nodes, isLoading } = useNodes();
  const createNode = useCreateNode();
  const deleteNode = useDeleteNode();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  const handleCreate = async (data: FormData) => {
    try {
      await createNode.mutateAsync(data);
      setIsDialogOpen(false);
      setSelectedParentId(null);
      toast({ title: "Logic Node Integrated", description: "Decision matrix updated successfully." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to create node", variant: "destructive" });
    }
  };

  const handleAddChild = (parentId: number) => {
    setSelectedParentId(parentId);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this logic node and all potential branches?")) {
      deleteNode.mutate(id);
    }
  };

  // Roots are nodes without parents
  const rootNodes = nodes?.filter(n => !n.parentId) || [];

  return (
    <div className="min-h-screen bg-background md:pl-64">
      <Navigation />
      
      <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl text-white mb-2">Omni-Choice Logic</h1>
            <p className="text-muted-foreground font-mono">
              Decision Tree // Probability Matrix
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if(!open) setSelectedParentId(null);
          }}>
            <DialogTrigger asChild>
              <button className="neon-button flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Root Node
              </button>
            </DialogTrigger>
            <DialogContent className="bg-background/90 border-white/10 backdrop-blur-xl text-white">
              <DialogHeader>
                <DialogTitle className="font-display tracking-widest text-primary">
                  {selectedParentId ? "NEW BRANCH NODE" : "NEW ROOT NODE"}
                </DialogTitle>
              </DialogHeader>
              <NodeForm 
                onSubmit={handleCreate} 
                isPending={createNode.isPending} 
                parentId={selectedParentId}
              />
            </DialogContent>
          </Dialog>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : (
          <div className="cyber-panel p-8 bg-black/20 min-h-[600px] overflow-auto custom-scrollbar">
            {rootNodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                <Network className="w-16 h-16 mb-4" />
                <p className="font-mono">NO LOGIC NODES DETECTED</p>
                <p className="text-sm">Initialize a root node to begin matrix construction</p>
              </div>
            ) : (
              rootNodes.map(node => (
                <TreeNode 
                  key={node.id} 
                  node={node} 
                  allNodes={nodes || []} 
                  onDelete={handleDelete}
                  onAddChild={handleAddChild}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
