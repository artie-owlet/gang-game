import ss from 'superstruct';

import type { Odds } from '../common-type-schemas/odds-schema';
import type { GameContext } from '../game-objects/game-context';
import { resourceTypeSchema, type ResourceType } from '../rules/resource-config';
import type { TraderType } from '../rules/trader-config';
import { updateComponent } from '../utils/game-object-class-factory';
import { JsonMap } from '../utils/json-tools';
import { randomBool, randomFromSet } from '../utils/random';
import { recordEntries } from '../utils/record-utils';

const tradingItemSchema = ss.object({
    maxAmount: ss.number(),
    updateInterval: ss.integer(),
    updateAmount: ss.number(),
    amount: ss.number(),
    updateCountDown: ss.integer(),
});

type TradingItem = ss.Infer<typeof tradingItemSchema>;

function createTradingItems(config: Record<ResourceType, Odds>, ctx: GameContext): Map<ResourceType, TradingItem> {
    return recordEntries(config).filter(([, odds]) => randomBool(odds, ctx.randomizer.rng)).
        reduce((items, [resourceType]) => {
            const { tradingItem } = ctx.rules.resourceConfig(resourceType);
            const maxAmount = randomFromSet(tradingItem.maxAmount, ctx.randomizer.rng);
            const updateInterval = randomFromSet(tradingItem.updateInterval, ctx.randomizer.rng);
            const updateAmount = randomFromSet(tradingItem.updateAmount, ctx.randomizer.rng);

            items.set(resourceType, {
                maxAmount,
                updateInterval,
                updateAmount,
                amount: maxAmount,
                updateCountDown: updateInterval,
            });
            return items;
        }, new JsonMap<ResourceType, TradingItem>());
}

export const traderSchema = ss.object({
    buyableTradingItems: ss.map(resourceTypeSchema, tradingItemSchema),
    saleableTradingItems: ss.map(resourceTypeSchema, tradingItemSchema),
});

type TraderData = ss.Infer<typeof traderSchema>;

export interface Trader extends TraderData {
}

export abstract class Trader {
    public static create(traderType: TraderType, ctx: GameContext): TraderData;
    public static create(): TraderData;
    public static create(...args: [TraderType, GameContext] | []): TraderData {
        if (args.length === 0) {
            return {
                buyableTradingItems: new JsonMap(),
                saleableTradingItems: new JsonMap(),
            };
        }

        const [traderType, ctx] = args;
        const config = ctx.rules.traderConfig(traderType);
        return {
            buyableTradingItems: createTradingItems(config.buyableResources, ctx),
            saleableTradingItems: createTradingItems(config.saleableResources, ctx),
        };
    }

    public get isTrader(): boolean {
        return this.buyableTradingItems.size > 0 || this.saleableTradingItems.size > 0;
    }

    public trade(operation: 'buy' | 'sell', resourceType: ResourceType, amount: number): void {
        const item = (operation === 'buy' ? this.buyableTradingItems : this.saleableTradingItems).get(resourceType);
        if (!item) {
            throw new Error('Cannot trade: no such resource type');
        }
        if (amount > item.amount) {
            throw new Error('Cannot trade item: too much amount');
        }
        item.amount -= amount;
    }

    public [updateComponent](): void {
        for (const item of [...this.buyableTradingItems.values(), ...this.saleableTradingItems.values()]) {
            --item.updateCountDown;
            if (item.updateCountDown === 0) {
                item.updateCountDown = item.updateInterval;
                item.amount += item.updateAmount;
                if (item.amount > item.maxAmount) {
                    item.amount = item.maxAmount;
                }
            }
        }
    }
}
