import ss from 'superstruct';

import { resourceTypeSchema, type ResourceType } from '../rules/resource-config';
import { updateComponent } from '../utils/create-game-object-class';

const tradingItemSchema = ss.object({
    maxAmount: ss.number(),
    updateInterval: ss.number(),
    updateAmount: ss.number(),
    amount: ss.number(),
    updateCountDown: ss.number(),
});

export type TradingItem = ss.Infer<typeof tradingItemSchema>;

function tradeItem(item: TradingItem, amount: number): void {
    if (amount > item.amount) {
        throw new Error('Cannot trade item: too much amount');
    }
    item.amount -= amount;
}

function updateItem(item: TradingItem): void {
    --item.updateCountDown;
    if (item.updateCountDown > 0) {
        return;
    }

    item.updateCountDown = item.updateInterval;
    item.amount += item.updateAmount;
    if (item.amount > item.maxAmount) {
        item.amount = item.maxAmount;
    }
}

export const traderSchema = ss.object({
    buyableTradingItems: ss.map(resourceTypeSchema, tradingItemSchema),
    saleableTradingItems: ss.map(resourceTypeSchema, tradingItemSchema),
});

export interface Trader extends ss.Infer<typeof traderSchema> {
}

export abstract class Trader {
    public get isTrader(): boolean {
        return this.buyableTradingItems.size > 0 || this.saleableTradingItems.size > 0;
    }

    public buy(operation: 'buy' | 'sell', resourceType: ResourceType, amount: number): void {
        const item = (operation === 'buy' ? this.buyableTradingItems : this.saleableTradingItems).get(resourceType);
        if (!item) {
            throw new Error('Cannot trade: no such resource type');
        }
        tradeItem(item, amount);
    }

    public [updateComponent](): void {
        this.buyableTradingItems.forEach((item) => updateItem(item));
        this.saleableTradingItems.forEach((item) => updateItem(item));
    }
}
