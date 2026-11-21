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
