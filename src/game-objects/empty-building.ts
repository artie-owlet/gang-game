import ss from 'superstruct';

import { Building, buildingSchema } from '../components/building';
import { ResourceStorage, resourceStorageSchema } from '../components/resource-storage';
import { Wallet, walletSchema } from '../components/wallet';
import type { BarType } from '../rules/bar-config';
import type { BusinessBuildingCost } from '../rules/business-building-cost';
import type { ProductionType } from '../rules/production-config';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { GameObjectClassFactory } from '../utils/game-object-class-factory';
import { generateId } from '../utils/random';
import { Bar } from './bar';
import type { GameContext } from './game-context';
import { Production } from './production';

export const emptyBuildingIdSchema = defineFlavoredStringSchema('EmptyBuildingId');

export type EmptyBuildingId = ss.Infer<typeof emptyBuildingIdSchema>;

export const emptyBuildingSchema = ss.intersection([
    ss.object({ id: emptyBuildingIdSchema }),
    buildingSchema,
    resourceStorageSchema,
    walletSchema,
]);

export class EmptyBuilding extends new GameObjectClassFactory(
    Building,
    ResourceStorage,
    Wallet,
).create<ss.Infer<typeof emptyBuildingSchema>>() {
    public static create(position: number, capacity: number, ctx: GameContext): EmptyBuilding {
        const building = new EmptyBuilding({
            id: generateId(),
            ...Building.create(position, ctx.randomizer.buildingName()),
            ...ResourceStorage.create(capacity),
            ...Wallet.create(),
        }, ctx);
        ctx.addEmptyBuilding(building);
        return building;
    }

    public static demolishBusiness(business: Bar | Production, ctx: GameContext): EmptyBuilding {
        const building = new EmptyBuilding(ss.mask(business, emptyBuildingSchema), ctx);
        if (business instanceof Bar) {
            ctx.demolishBar(building);
        } else if (business instanceof Production) {
            ctx.demolishProduction(building);
        }
        return building;
    }

    public canUpgradeToBar(type: BarType): boolean {
        return this.canTakeBuildingCost(this.ctx.rules.barConfig(type).buildingCost);
    }

    public canUpgradeToProduction(type: ProductionType): boolean {
        return this.canTakeBuildingCost(this.ctx.rules.productionConfig(type).buildingCost);
    }

    public takeBuildingCost(cost: BusinessBuildingCost): void {
        if (!this.canTakeBuildingCost(cost)) {
            throw new Error('Cannot take building cost');
        }

        this.takeMoney(cost.money);
        cost.resources.forEach((up) => this.takeResource(up.resourceType, up.amount));
    }

    private canTakeBuildingCost(cost: BusinessBuildingCost): boolean {
        if (this.money < cost.money) {
            return false;
        }
        if (cost.resources.some((res) => !this.canTakeAmount(res.resourceType, res.amount))) {
            return false;
        }
        return true;
    }
}
