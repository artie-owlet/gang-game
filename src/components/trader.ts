import ss from 'superstruct';

import type { Odds } from '../common-type-schemas/odds-schema';
import type { GameContext } from '../game-objects/game-context';
import { resourceTypeSchema, type ResourceType } from '../rules/resource-config';
import type { TraderType } from '../rules/trader-config';
import { createCompMemberClass } from '../utils/create-comp-member-class';
import { initComponent, updateComponent } from '../utils/game-object-class-factory';
import { randomBool, randomFromSet } from '../utils/random';
import { recordEntries } from '../utils/record-utils';

const tradingItemDataSchema = ss.object({
    maxAmount: ss.number(),
    updateInterval: ss.number(),
    updateAmount: ss.number(),
    amount: ss.number(),
    updateCountDown: ss.number(),
});

type TradingItemData = ss.Infer<typeof tradingItemDataSchema>;

export interface TradingItem extends TradingItemData {
}

export class TradingItem extends createCompMemberClass<TradingItemData>() {
    public trade(amount: number): void {
        if (amount > this.amount) {
            throw new Error('Cannot trade item: too much amount');
        }
        this.amount -= amount;
    }

    public update(): void {
        --this.updateCountDown;
        if (this.updateCountDown > 0) {
            return;
        }

        this.updateCountDown = this.updateInterval;
        this.amount += this.updateAmount;
        if (this.amount > this.maxAmount) {
            this.amount = this.maxAmount;
        }
    }
}

const tradingItemSchema = ss.define<TradingItem>('TradingItem', (value) => {
    const [err] = ss.validate(value, tradingItemDataSchema);
    return err ? err.failures() : true;
});

export const traderSchema = ss.object({
    buyableTradingItems: ss.map(resourceTypeSchema, tradingItemSchema),
    saleableTradingItems: ss.map(resourceTypeSchema, tradingItemSchema),
});

type TraderData = ss.Infer<typeof traderSchema>;

function createTradingItems(config: Record<ResourceType, Odds>, ctx: GameContext): Map<ResourceType, TradingItem> {
    return recordEntries(config).filter(([, odds]) => randomBool(odds, ctx.randomizer.rng)).
        reduce((items, [resourceType]) => {
            const { tradeItem } = ctx.rules.resourceConfig(resourceType);
            const maxAmount = randomFromSet(tradeItem.maxAmount, ctx.randomizer.rng);
            const updateInterval = randomFromSet(tradeItem.updateInterval, ctx.randomizer.rng);
            const updateAmount = randomFromSet(tradeItem.updateAmount, ctx.randomizer.rng);

            items.set(resourceType, new TradingItem({
                maxAmount,
                updateInterval,
                updateAmount,
                amount: maxAmount,
                updateCountDown: updateInterval,
            }));
            return items;
        }, new Map<ResourceType, TradingItem>());
}

export interface Trader extends TraderData {
}

export abstract class Trader {
    public static create(traderType: TraderType, ctx: GameContext): TraderData;
    public static create(): TraderData;
    public static create(...args: [TraderType, GameContext] | []): TraderData {
        if (args.length === 0) {
            return {
                buyableTradingItems: new Map(),
                saleableTradingItems: new Map(),
            };
        }

        const [traderType, ctx] = args;
        const config = ctx.rules.traderConfig(traderType);
        return {
            buyableTradingItems: createTradingItems(config.buyableResources, ctx),
            saleableTradingItems: createTradingItems(config.saleableResources, ctx),
        };
    }

    public [initComponent]() {
        this.buyableTradingItems.forEach((item, key) => this.buyableTradingItems.set(key, new TradingItem(item)));
        this.saleableTradingItems.forEach((item, key) => this.saleableTradingItems.set(key, new TradingItem(item)));
    }

    public get isTrader(): boolean {
        return this.buyableTradingItems.size > 0 || this.saleableTradingItems.size > 0;
    }

    public trade(operation: 'buy' | 'sell', resourceType: ResourceType, amount: number): void {
        const item = (operation === 'buy' ? this.buyableTradingItems : this.saleableTradingItems).get(resourceType);
        if (!item) {
            throw new Error('Cannot trade: no such resource type');
        }
        item.trade(amount);
    }

    public [updateComponent](): void {
        this.buyableTradingItems.forEach((item) => item.update());
        this.saleableTradingItems.forEach((item) => item.update());
    }
}
