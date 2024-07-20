import ss from 'superstruct';

import { resourceTypeSchema } from '../rules/resource-config';

export const tradeItemDataSchema = ss.object({
    resourceType: resourceTypeSchema,
    maxAmount: ss.number(),
    updateInterval: ss.number(),
    updateAmount: ss.number(),
    amount: ss.number(),
    updateCountDown: ss.number(),
});

export type TradeItemData = ss.Infer<typeof tradeItemDataSchema>;

export function isTradeItemData(data: unknown): data is TradeItemData {
    return ss.is(data, tradeItemDataSchema);
}
