import ss from 'superstruct';

import { weightedNumberSetSchema } from '../common-type-schemas/weighted-set';
import { defineFlavoredStringSchema } from '../utils/flavored-string';

export const resourceTypeSchema = defineFlavoredStringSchema('ResourceType');

export type ResourceType = ss.Infer<typeof resourceTypeSchema>;

const resourceConfigSchema = ss.object({
    price: ss.number(),
    size: ss.number(),
    legal: ss.boolean(),
    tradingItem: ss.object({
        maxAmount: weightedNumberSetSchema,
        updateInterval: weightedNumberSetSchema,
        updateAmount: weightedNumberSetSchema,
    }),
});

export type ResourceConfig = ss.Infer<typeof resourceConfigSchema>;
