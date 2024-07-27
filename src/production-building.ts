import { BaseStorageBuilding } from './base-storage-building';
import type { EmptyBuilding } from './empty-building';
import type { GameContext } from './game-context';
import type { Gangster } from './gangster';
import { isProductionBuildingData, type ProductionBuildingData } from './schema/data/production-building-data';
import type {
    ProductionBuildingConfig,
    ProductionBuildingType,
    ProductionReceipe,
} from './schema/rules/production-building-config';

type CtorArgs = [ProductionBuildingData, GameContext] | [
    building: EmptyBuilding,
    type: ProductionBuildingType,
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [ProductionBuildingData, GameContext] {
    return isProductionBuildingData(args[0]);
}

export class ProductionBuilding extends BaseStorageBuilding<'ProductionBuildingId'> {
    public readonly type: ProductionBuildingType;
    public readonly manager: Gangster | null;

    private currentReceipe_: Readonly<ProductionReceipe> | null;
    private countDown_: number;
    private game: GameContext;

    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data, game] = args;
            super(data, game);
            this.type = data.type;
            this.manager = data.managerId ? game.gangster(data.managerId) : null;
            this.currentReceipe_ = data.currentReceipe;
            this.countDown_ = data.countDown;
            this.game = game;
        } else {
            const [building, type, game] = args;
            super(building);
            this.type = type;
            this.manager = null;
            this.currentReceipe_ = null;
            this.countDown_ = 0;
            this.game = game;
        }
    }

    public override serialize(): ProductionBuildingData {
        return {
            ...super.serialize(),
            type: this.type,
            managerId: this.manager ? this.manager.id : null,
            currentReceipe: this.currentReceipe_,
            countDown: this.countDown_,
        };
    }

    public get config(): Readonly<ProductionBuildingConfig> {
        return this.game.rules.productionBuildingConfig(this.type);
    }

    public get currentReceipe(): Readonly<ProductionReceipe> | null {
        return this.currentReceipe_;
    }

    public get countDown(): number {
        return this.countDown_;
    }

    public update(): void {
        if (this.currentReceipe_) {
            --this.countDown_;
            if (this.countDown_ === 0) {
                const product = this.currentReceipe_.product;
                const maxAmount = this.storage.canAddAmount(product.resourceType);
                if (product.amount > maxAmount) {
                    this.storage.addResource(product.resourceType, maxAmount);
                } else {
                    this.storage.addResource(product.resourceType, product.amount);
                }
                this.currentReceipe_ = null;
            }
        }

        if (!this.currentReceipe_) {
            const nextReceipe = this.config.receipes.find((receipe) => {
                return receipe.inputs.every((input) => this.storage.canTakeAmount(input.resourceType, input.amount));
            });
            if (nextReceipe) {
                this.currentReceipe_ = nextReceipe;
                this.countDown_ = nextReceipe.time;
                nextReceipe.inputs.forEach((input) => this.storage.takeResource(input.resourceType, input.amount));
            }
        }
    }
}
