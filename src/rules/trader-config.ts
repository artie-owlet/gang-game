import ss from 'superstruct';

import { oddsSchema } from '../common-type-schemas/odds-schema';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { resourceTypeSchema } from './resource-config';

export const traderTypeSchema = defineFlavoredStringSchema('TraderType');

export type TraderType = ss.Infer<typeof traderTypeSchema>;

export const traderConfigSchema = ss.object({
    buyableResources: ss.record(resourceTypeSchema, oddsSchema),
    saleableResources: ss.record(resourceTypeSchema, oddsSchema),
});

export type TraderConfig = ss.Infer<typeof traderConfigSchema>;
