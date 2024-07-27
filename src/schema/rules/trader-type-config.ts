import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../../utils/flavored-string';
import { oddsSchema } from '../utils/odds-schema';
import { resourceTypeSchema } from './resource-config';

export const traderTypeSchema = defineFlavoredStringSchema('TraderType');

export type TraderType = ss.Infer<typeof traderTypeSchema>;

const tradeItemConfigSchema = ss.object({
    resourceType: resourceTypeSchema,
    odds: oddsSchema,
});

export type TradeItemConfig = ss.Infer<typeof tradeItemConfigSchema>;

export const traderConfigSchema = ss.object({
    traderType: traderTypeSchema,
    buyableResources: ss.array(tradeItemConfigSchema),
    saleableResources: ss.array(tradeItemConfigSchema),
});

export type TraderConfig = ss.Infer<typeof traderConfigSchema>;
