import { z } from 'zod';
import { insertLayerSchema, insertNodeSchema, insertSimulationSchema, resonanceLayers, decisionNodes, quantumSimulations } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  layers: {
    list: {
      method: 'GET' as const,
      path: '/api/layers',
      responses: {
        200: z.array(z.custom<typeof resonanceLayers.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/layers',
      input: insertLayerSchema,
      responses: {
        201: z.custom<typeof resonanceLayers.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/layers/:id',
      input: insertLayerSchema.partial(),
      responses: {
        200: z.custom<typeof resonanceLayers.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/layers/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  nodes: {
    list: {
      method: 'GET' as const,
      path: '/api/nodes',
      responses: {
        200: z.array(z.custom<typeof decisionNodes.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/nodes',
      input: insertNodeSchema,
      responses: {
        201: z.custom<typeof decisionNodes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/nodes/:id',
      responses: {
        204: z.void(),
      },
    }
  },
  simulations: {
    list: {
      method: 'GET' as const,
      path: '/api/simulations',
      responses: {
        200: z.array(z.custom<typeof quantumSimulations.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/simulations',
      input: insertSimulationSchema,
      responses: {
        201: z.custom<typeof quantumSimulations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
