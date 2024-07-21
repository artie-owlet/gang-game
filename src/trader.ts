import type { GameContext } from './game-context';
import { isTraderData, type TraderData, type TraderId } from './schema/data/trader-data';
import type { ResourceType } from './schema/rules/resource-config';
import { TradeItem } from './trade-item';
import { generateId } from './utils/random';

type CtorArgs = [TraderData] | [
    buyableResources: ResourceType[],
    saleableResources: ResourceType[],
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [TraderData] {
    return isTraderData(args[0]);
}

export class Trader {
    public readonly id: TraderId;
    public readonly name: string;

    private buyableItems_: TradeItem[];
    private saleableItems_: TradeItem[];

    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data] = args;
            this.id = data.id;
            this.name = data.name;
            this.buyableItems_ = data.buyableItems.map((item) => new TradeItem(item));
            this.saleableItems_ = data.saleableItems.map((item) => new TradeItem(item));
        } else {
            const [buyableResources, saleableResources, game] = args;
            this.id = generateId();
            this.name = game.randomizer.randomBuildingName();
            this.buyableItems_ = buyableResources.map((resourceType) => new TradeItem(resourceType, game));
            this.saleableItems_ = saleableResources.map((resourceType) => new TradeItem(resourceType, game));
        }
    }

    public serialize(): TraderData {
        return {
            id: this.id,
            name: this.name,
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
