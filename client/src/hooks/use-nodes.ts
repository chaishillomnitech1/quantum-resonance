import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertDecisionNode } from "@shared/schema";

export function useNodes() {
  return useQuery({
    queryKey: [api.nodes.list.path],
    queryFn: async () => {
      const res = await fetch(api.nodes.list.path);
      if (!res.ok) throw new Error("Failed to fetch decision nodes");
      return api.nodes.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateNode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDecisionNode) => {
      const res = await fetch(api.nodes.create.path, {
        method: api.nodes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create node");
      return api.nodes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.nodes.list.path] }),
  });
}

export function useDeleteNode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.nodes.delete.path, { id });
      const res = await fetch(url, { method: api.nodes.delete.method });
      if (!res.ok) throw new Error("Failed to delete node");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.nodes.list.path] }),
  });
}
