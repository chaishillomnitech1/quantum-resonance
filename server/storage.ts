import { db } from "./db";
import {
  resonanceLayers,
  decisionNodes,
  quantumSimulations,
  type Layer,
  type InsertLayer,
  type DecisionNode,
  type InsertDecisionNode,
  type Simulation,
  type InsertSimulation
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Layers
  getLayers(): Promise<Layer[]>;
  getLayer(id: number): Promise<Layer | undefined>;
  createLayer(layer: InsertLayer): Promise<Layer>;
  updateLayer(id: number, layer: Partial<InsertLayer>): Promise<Layer>;
  deleteLayer(id: number): Promise<void>;

  // Nodes
  getNodes(): Promise<DecisionNode[]>;
  createNode(node: InsertDecisionNode): Promise<DecisionNode>;
  deleteNode(id: number): Promise<void>;

  // Simulations
  getSimulations(): Promise<Simulation[]>;
  createSimulation(sim: InsertSimulation): Promise<Simulation>;
}

export class DatabaseStorage implements IStorage {
  async getLayers(): Promise<Layer[]> {
    return await db.select().from(resonanceLayers);
  }

  async getLayer(id: number): Promise<Layer | undefined> {
    const [layer] = await db.select().from(resonanceLayers).where(eq(resonanceLayers.id, id));
    return layer;
  }

  async createLayer(layer: InsertLayer): Promise<Layer> {
    const [newLayer] = await db.insert(resonanceLayers).values(layer).returning();
    return newLayer;
  }

  async updateLayer(id: number, updates: Partial<InsertLayer>): Promise<Layer> {
    const [updated] = await db.update(resonanceLayers)
      .set(updates)
      .where(eq(resonanceLayers.id, id))
      .returning();
    return updated;
  }

  async deleteLayer(id: number): Promise<void> {
    await db.delete(resonanceLayers).where(eq(resonanceLayers.id, id));
  }

  async getNodes(): Promise<DecisionNode[]> {
    return await db.select().from(decisionNodes);
  }

  async createNode(node: InsertDecisionNode): Promise<DecisionNode> {
    const [newNode] = await db.insert(decisionNodes).values(node).returning();
    return newNode;
  }

  async deleteNode(id: number): Promise<void> {
    await db.delete(decisionNodes).where(eq(decisionNodes.id, id));
  }

  async getSimulations(): Promise<Simulation[]> {
    return await db.select().from(quantumSimulations).orderBy(desc(quantumSimulations.timestamp));
  }

  async createSimulation(sim: InsertSimulation): Promise<Simulation> {
    const [newSim] = await db.insert(quantumSimulations).values(sim).returning();
    return newSim;
  }
}

export const storage = new DatabaseStorage();
