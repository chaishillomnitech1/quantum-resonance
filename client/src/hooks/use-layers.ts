import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertLayer } from "@shared/schema";

export function useLayers() {
  return useQuery({
    queryKey: [api.layers.list.path],
    queryFn: async () => {
      const res = await fetch(api.layers.list.path);
      if (!res.ok) throw new Error("Failed to fetch resonance layers");
      return api.layers.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertLayer) => {
      const res = await fetch(api.layers.create.path, {
        method: api.layers.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Validation failed");
        }
        throw new Error("Failed to create layer");
      }
      return api.layers.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.layers.list.path] }),
  });
}

export function useUpdateLayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<InsertLayer>) => {
      const url = buildUrl(api.layers.update.path, { id });
      const res = await fetch(url, {
        method: api.layers.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update layer");
      return api.layers.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.layers.list.path] }),
  });
}

export function useDeleteLayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.layers.delete.path, { id });
      const res = await fetch(url, { method: api.layers.delete.method });
      if (!res.ok) throw new Error("Failed to delete layer");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.layers.list.path] }),
  });
}
