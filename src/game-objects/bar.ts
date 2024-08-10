import ss from 'superstruct';

import { Building, buildingSchema } from '../components/building';
import {
    BuildingUpgradeable,
    defineBuildingUpgradeableSchema,
} from '../components/building-upgradeable';
import { Manageable, manageableSchema } from '../components/manageable';
import { ResourceStorage, resourceStorageSchema } from '../components/resource-storage';
import type { Updateable } from '../components/updateable';
import { Wallet, walletSchema } from '../components/wallet';
import { barTypeSchema, type BarConfig, type BarUpgrade } from '../rules/bar-config';
import { GameObjectFactory } from '../utils/create-game-object-class';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import type { GameContext } from './game-context';

export const barIdSchema = defineFlavoredStringSchema('BarId');

export type BarId = ss.Infer<typeof barIdSchema>;

const barPrivateSchema = ss.object({
    id: barIdSchema,
    type: barTypeSchema,
});

export const barSchema = ss.intersection([
    barPrivateSchema,
    buildingSchema,
    resourceStorageSchema,
    walletSchema,
    manageableSchema,
    defineBuildingUpgradeableSchema('BarType'),
]);

type BarData = ss.Infer<typeof barSchema>;

export class Bar extends new GameObjectFactory(
    Building,
    ResourceStorage,
    Wallet,
    Manageable,
    BuildingUpgradeable<'BarType'>,
).create<BarData>() implements Updateable {
    public constructor(data: BarData, ctx: GameContext) {
        super(data, ctx);
    }

    public update(): void {
        if (this.isUnderConstruction) {
            return;
        }

        this.config.goods.forEach(({ resourceType, amount }) => {
            const maxAmount = this.getResourceAmount(resourceType);
            const price = this.ctx.rules.resourceConfig(resourceType).price * this.config.priceMult;
            if (amount > maxAmount) {
                this.takeResource(resourceType, maxAmount);
                this.addMoney(maxAmount * price);
            } else {
                this.takeResource(resourceType, amount);
                this.addMoney(amount * price);
            }
        });
    }

    protected override getBuildingUpgrades(): BarUpgrade[] {
        return this.config.upgrades;
    }

    protected override onUpgrade(): void {
    }

    private get config(): BarConfig {
        return this.ctx.rules.barConfig(this.type);
    }
}
