import ss from 'superstruct';

import { weightedSetSchema } from '../common-type-schemas/weighted-set';
import { defineFlavoredStringSchema } from '../utils/flavored-string';

export const resourceTypeSchema = defineFlavoredStringSchema('ResourceType');

export type ResourceType = ss.Infer<typeof resourceTypeSchema>;

const resourceConfigSchema = ss.object({
    price: ss.number(),
    size: ss.number(),
    legal: ss.boolean(),
    tradingItem: ss.object({
        maxAmount: weightedSetSchema,
        updateInterval: weightedSetSchema,
        updateAmount: weightedSetSchema,
    }),
});

export type ResourceConfig = ss.Infer<typeof resourceConfigSchema>;
