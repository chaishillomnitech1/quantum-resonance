import { pgTable, text, serial, integer, boolean, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const resonanceLayers = pgTable("resonance_layers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  frequency: real("frequency").notNull(), // Hz
  amplitude: real("amplitude").notNull(),
  phase: real("phase").notNull(),
  coherence: real("coherence").default(0),
  status: text("status").notNull().default("active"), // active, dormant, unstable
  createdAt: timestamp("created_at").defaultNow(),
});

export const decisionNodes = pgTable("decision_nodes", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  type: text("type").notNull(), // root, branch, leaf
  parentId: integer("parent_id"),
  probability: real("probability").default(1.0),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quantumSimulations = pgTable("quantum_simulations", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  parameters: jsonb("parameters").notNull(),
  resultScore: real("result_score"),
  status: text("status").notNull(), // running, completed, collapsed
});

export const insertLayerSchema = createInsertSchema(resonanceLayers).omit({ id: true, createdAt: true });
export const insertNodeSchema = createInsertSchema(decisionNodes).omit({ id: true, createdAt: true });
export const insertSimulationSchema = createInsertSchema(quantumSimulations).omit({ id: true, timestamp: true });

export type Layer = typeof resonanceLayers.$inferSelect;
export type InsertLayer = z.infer<typeof insertLayerSchema>;

export type DecisionNode = typeof decisionNodes.$inferSelect;
export type InsertDecisionNode = z.infer<typeof insertNodeSchema>;

export type Simulation = typeof quantumSimulations.$inferSelect;
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
