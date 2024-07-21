import type { GameContext } from './game-context';
import type { ResourceType } from './schema/rules/resource-config';
import type { TradeItem } from './trade-item';
import type { Trader } from './trader';
import type { OccupiedVehicle } from './vehicle';

abstract class TradeOperation {
    public readonly resourceType: ResourceType;
    public readonly price: number;

    protected amount = 0;

    public constructor(
        public readonly vehicle: OccupiedVehicle,
        public readonly trader: Trader,
        public readonly tradeItem: TradeItem,
        protected game: GameContext,
    ) {
        this.resourceType = tradeItem.resourceType;
        this.price = game.rules.resourceConfig(tradeItem.resourceType).price;
    }

    public decreaseAmount(dec: number): void {
        this.amount -= dec;
        if (this.amount < 0) {
            this.amount = 0;
        }
    }

    public commit(): void {
        this.tradeItem.trade(this.amount);
        this.amount = 0;
    }

    public cancel(): void {
        this.amount = 0;
    }
}

export class BuyOperation extends TradeOperation {
    public constructor(
        vehicle: OccupiedVehicle,
        trader: Trader,
        tradeItem: TradeItem,
        game: GameContext,
    ) {
        super(vehicle, trader, tradeItem, game);
    }

    public get vehicleAmount(): number {
        return this.vehicle.cargo.getResourceUnits(this.resourceType) + this.amount;
    }

    public get traderAmount(): number {
        return this.tradeItem.amount - this.amount;
    }

    public get canBuyOneMore(): boolean {
        return this.vehicle.wallet.money >= this.price &&
            this.vehicle.cargo.canAddUnits(this.resourceType) > 0 &&
            this.tradeItem.amount >= 1;
    }

    public increaseAmount(inc: number): void {
        this.amount += inc;
        if (this.amount * this.price > this.vehicle.wallet.money) {
            this.amount = this.vehicle.wallet.money / this.price | 0;
        }
        if (this.amount > this.tradeItem.amount) {
            this.amount = this.tradeItem.amount;
        }
    }

    public override commit(): void {
        this.vehicle.cargo.addResource(this.resourceType, this.amount);
        this.vehicle.wallet.takeMoney(this.amount * this.price);
        super.commit();
    }
}

export class SaleOperation extends TradeOperation {
    public constructor(
        vehicle: OccupiedVehicle,
        trader: Trader,
        tradeItem: TradeItem,
        game: GameContext,
    ) {
        super(vehicle, trader, tradeItem, game);
    }

    public get vehicleAmount(): number {
        return this.vehicle.cargo.getResourceUnits(this.resourceType) - this.amount;
    }

    public get traderAmount(): number {
        return this.tradeItem.amount + this.amount;
    }

    public get canSellOneMore(): boolean {
        return this.vehicle.cargo.getResourceUnits(this.resourceType) > 0 &&
            this.tradeItem.amount >= 1;
    }

    public increaseAmount(inc: number): void {
        this.amount += inc;
        if (this.amount > this.vehicle.cargo.getResourceUnits(this.resourceType)) {
            this.amount = this.vehicle.cargo.getResourceUnits(this.resourceType);
        }
    }

    public override commit(): void {
        this.vehicle.cargo.takeResource(this.resourceType, this.amount);
        this.vehicle.wallet.addMoney(this.amount * this.price);
        super.commit();
    }
}
