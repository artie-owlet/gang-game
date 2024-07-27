import { BasePerson } from './base-person';
import type { GameContext } from './game-context';
import { isTraderData, type TraderData } from './schema/data/trader-data';
import type { ResourceType } from './schema/rules/resource-config';
import type { TradeItemConfig, TraderType } from './schema/rules/trader-type-config';
import { TradeItem } from './trade-item';
import { randomBool } from './utils/random';

function selectTradeResources(configs: TradeItemConfig[], game: GameContext): ResourceType[] {
    return configs.filter((item) => randomBool(item.odds, game.randomizer.rng)).
        map((item) => item.resourceType);
}

type CtorArgs = [TraderData] | [
    type: TraderType,
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [TraderData] {
    return isTraderData(args[0]);
}

export class Trader extends BasePerson<'TraderId'> {
    private buyableItems_: TradeItem[];
    private saleableItems_: TradeItem[];

    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data] = args;
            super(data);
            this.buyableItems_ = data.buyableItems.map((item) => new TradeItem(item));
            this.saleableItems_ = data.saleableItems.map((item) => new TradeItem(item));
        } else {
            const [type, game] = args;
            super(game);
            const config = game.rules.traderConfig(type);
            this.buyableItems_ = selectTradeResources(config.buyableResources, game).
                map((resourceType) => new TradeItem(resourceType, game));
            this.saleableItems_ = selectTradeResources(config.saleableResources, game).
                map((resourceType) => new TradeItem(resourceType, game));
        }
    }

    public override serialize(): TraderData {
        return {
            ...super.serialize(),
            buyableItems: this.buyableItems_.map((item) => item.serialize()),
            saleableItems: this.saleableItems_.map((item) => item.serialize()),
        };
    }

    public get buyableItems(): readonly TradeItem[] {
        return this.buyableItems_;
    }

    public get saleableItems(): readonly TradeItem[] {
        return this.saleableItems_;
    }

    public getBuyableItem(resourceType: ResourceType): TradeItem {
        const item = this.buyableItems_.find((it) => it.resourceType === resourceType);
        if (!item) {
            throw new Error(`No buyable item for ${resourceType}`);
        }
        return item;
    }

    public getSaleableItem(resourceType: ResourceType): TradeItem {
        const item = this.saleableItems_.find((it) => it.resourceType === resourceType);
        if (!item) {
            throw new Error(`No saleable item for ${resourceType}`);
        }
        return item;
    }

    public update(): void {
        this.buyableItems_.forEach((item) => item.update());
        this.saleableItems_.forEach((item) => item.update());
    }
}
