import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { weightedSetSchema } from '../utils/weighted-set';

export const resourceTypeSchema = defineFlavoredStringSchema('ResourceType');

export type ResourceType = ss.Infer<typeof resourceTypeSchema>;

const resourceConfigSchema = ss.object({
    type: resourceTypeSchema,
    price: ss.number(),
    size: ss.number(),
    legal: ss.boolean(),
    tradeItem: ss.object({
        maxAmount: weightedSetSchema,
        updateInterval: weightedSetSchema,
        updateAmount: weightedSetSchema,
    }),
});

export type ResourceConfig = ss.Infer<typeof resourceConfigSchema>;
