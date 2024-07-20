import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { tradeItemDataSchema } from './trade-item-data';

export const traderIdSchema = defineFlavoredStringSchema('TradeBuildingId');

export type TraderId = ss.Infer<typeof traderIdSchema>;

export const traderDataSchema = ss.object({
    id: traderIdSchema,
    name: ss.string(),
    buyableItems: ss.array(tradeItemDataSchema),
    saleableItems: ss.array(tradeItemDataSchema),
});

export type TraderData = ss.Infer<typeof traderDataSchema>;

export function isTraderData(data: unknown): data is TraderData {
    return ss.is(data, traderDataSchema);
}
