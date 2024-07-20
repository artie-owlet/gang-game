import type { GameContext } from './game-context';
import { isTradeItemData, type TradeItemData } from './schema/data/trade-item-data';
import type { ResourceType } from './schema/rules/resource-config';
import { randomFromSet } from './utils/random';

type CtorArgs = [TradeItemData] | [
    resourceType: ResourceType,
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [TradeItemData] {
    return isTradeItemData(args[0]);
}

export class TradeItem {
    public readonly resourceType: ResourceType;
    public readonly maxAmount: number;
    public readonly updateInterval: number;
    public readonly updateAmount: number;

    // how much the trader can to sell or to buy
    private amount_: number;
    private updateCountDown_: number;

    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data] = args;
            this.resourceType = data.resourceType;
            this.maxAmount = data.maxAmount;
            this.updateInterval = data.updateInterval;
            this.updateAmount = data.updateAmount;
            this.amount_ = data.amount;
            this.updateCountDown_ = data.updateCountDown;
        } else {
            const [resourceType, game] = args;
            this.resourceType = resourceType;

            const config = game.resourceConfig(resourceType).tradeItem;
            this.maxAmount = randomFromSet(config.maxAmount, game);
            this.updateInterval = randomFromSet(config.updateInterval, game);
            this.updateAmount = randomFromSet(config.updateAmount, game);

            this.amount_ = this.maxAmount;
            this.updateCountDown_ = this.updateInterval;
        }
    }

    public serialize(): TradeItemData {
        return {
            resourceType: this.resourceType,
            maxAmount: this.maxAmount,
            updateInterval: this.updateInterval,
            updateAmount: this.updateAmount,
            amount: this.amount_,
            updateCountDown: this.updateCountDown_,
        };
    }

    public get amount(): number {
        return this.amount_;
    }

    public get updateCountDown(): number {
        return this.updateCountDown_;
    }

    public trade(amount: number): void {
        if (amount > this.amount_) {
            throw new Error(`Cannot trade: ${amount} is requested but ${this.amount_} is available`);
        }
        this.amount_ -= amount;
    }

    public update(): void {
        --this.updateCountDown_;
        if (this.updateCountDown_ > 0) {
            return;
        }

        this.updateCountDown_ = this.updateInterval;
        this.amount_ += this.updateAmount;
        if (this.amount_ > this.maxAmount) {
            this.amount_ = this.maxAmount;
        }
    }
}
