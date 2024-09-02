import ss from 'superstruct';

import type { Odds } from '../common-type-schemas/odds-schema';
import { Building, buildingSchema } from '../components/building';
import { Person, personSchema } from '../components/person';
import { Relationships, relationshipsSchema } from '../components/relationships';
import type { GameContext } from '../game-objects/game-context';
import { resourceTypeSchema, type ResourceType } from '../rules/resource-config';
import type { TraderType } from '../rules/trader-config';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { GameObjectClassFactory } from '../utils/game-object-class-factory';
import { JsonMap } from '../utils/json-tools';
import { generateId, randomBool, randomFromSet } from '../utils/random';
import { recordEntries } from '../utils/record-utils';

const tradingItemSchema = ss.object({
    maxAmount: ss.number(),
    updateInterval: ss.integer(),
    updateAmount: ss.number(),
    amount: ss.number(),
    updateCountDown: ss.integer(),
});

type TradingItem = ss.Infer<typeof tradingItemSchema>;

function createTradingItems(config: Record<ResourceType, Odds>, ctx: GameContext): JsonMap<ResourceType, TradingItem> {
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

export const traderIdSchema = defineFlavoredStringSchema('TraderId');

export type TraderId = ss.Infer<typeof traderIdSchema>;

export const traderPrivateSchema = ss.object({
    id: traderIdSchema,
    buyableTradingItems: ss.map(resourceTypeSchema, tradingItemSchema),
    saleableTradingItems: ss.map(resourceTypeSchema, tradingItemSchema),
});

export const traderSchema = ss.intersection([
    traderPrivateSchema,
    buildingSchema,
    personSchema,
    relationshipsSchema,
]);

export class Trader extends new GameObjectClassFactory(
    Building,
    Person,
    Relationships,
).create<ss.Infer<typeof traderSchema>>() {
    public static create(traderType: TraderType, position: number, ctx: GameContext): Trader {
        const config = ctx.rules.traderConfig(traderType);
        return new Trader({
            id: generateId(),
            buyableTradingItems: createTradingItems(config.buyableResources, ctx),
            saleableTradingItems: createTradingItems(config.saleableResources, ctx),
            position,
            ...Person.create(ctx.randomizer),
            ...Relationships.create(),
        }, ctx);
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

    public update(): void {
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
