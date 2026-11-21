import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Layers
  app.get(api.layers.list.path, async (req, res) => {
    const layers = await storage.getLayers();
    res.json(layers);
  });

  app.post(api.layers.create.path, async (req, res) => {
    try {
      const input = api.layers.create.input.parse(req.body);
      const layer = await storage.createLayer(input);
      res.status(201).json(layer);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.layers.update.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.layers.update.input.parse(req.body);
      const layer = await storage.updateLayer(id, input);
      res.json(layer);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.layers.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteLayer(id);
    res.status(204).end();
  });

  // Nodes
  app.get(api.nodes.list.path, async (req, res) => {
    const nodes = await storage.getNodes();
    res.json(nodes);
  });

  app.post(api.nodes.create.path, async (req, res) => {
    try {
      const input = api.nodes.create.input.parse(req.body);
      const node = await storage.createNode(input);
      res.status(201).json(node);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.nodes.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteNode(id);
    res.status(204).end();
  });

  // Simulations
  app.get(api.simulations.list.path, async (req, res) => {
    const sims = await storage.getSimulations();
    res.json(sims);
  });

  app.post(api.simulations.create.path, async (req, res) => {
    try {
      const input = api.simulations.create.input.parse(req.body);
      // Simulate some processing time or result calculation if needed
      const sim = await storage.createSimulation(input);
      res.status(201).json(sim);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}

// Seed function
async function seedDatabase() {
  const existingLayers = await storage.getLayers();
  if (existingLayers.length === 0) {
    await storage.createLayer({
      name: "Alpha Resonance",
      frequency: 432,
      amplitude: 0.8,
      phase: 0,
      coherence: 0.95,
      status: "active"
    });
    await storage.createLayer({
      name: "Beta Harmonics",
      frequency: 528,
      amplitude: 0.5,
      phase: 90,
      coherence: 0.88,
      status: "stable"
    });
    
    await storage.createNode({
      label: "Initial Singularity",
      type: "root",
      probability: 1.0,
      metadata: { description: "The starting point of the omni-choice matrix" }
    });
    
    await storage.createSimulation({
      parameters: { mode: "quantum_tunneling", intensity: "high" },
      resultScore: 0.99,
      status: "completed"
    });
  }
}

// Call seed in the background
seedDatabase().catch(console.error);
