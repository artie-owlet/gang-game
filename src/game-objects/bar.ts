import ss from 'superstruct';

import { Building, buildingSchema } from '../components/building';
import { BuildingUpgradeable, buildingUpgradeableSchema, type BuildingUpgradeChanges } from '../components/building-upgradeable';
import { Manageable, manageableSchema } from '../components/manageable';
import { ResourceStorage, resourceStorageSchema } from '../components/resource-storage';
import { Wallet, walletSchema } from '../components/wallet';
import { barTypeSchema, type BarUpgrade } from '../rules/bar-config';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { GameObjectFactory } from '../utils/create-game-object-class';
import type { GameContext } from './game-context';
import type { ResourceConfig, ResourceType } from '../rules/resource-config';
import type { Gangster, GangsterId } from './gangster';

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
    buildingUpgradeableSchema,
]);

type BarData = ss.Infer<typeof barSchema>;

export class Bar extends new GameObjectFactory(
    Building,
    ResourceStorage,
    Wallet,
    Manageable,
    BuildingUpgradeable,
).create<BarData>() {
    public constructor(
        data: BarData,
        private ctx: GameContext,
    ) {
        super(data);
    }

    protected override getResourceConfig(resourceType: ResourceType): ResourceConfig {
        return this.ctx.rules.resourceConfig(resourceType);
    }

    protected override getGangster(id: GangsterId): Gangster {
        return this.ctx.gangster(id);
    }

    protected override getBuildingUpgrades(): BarUpgrade[] {
        return this.ctx.rules.barConfig(this.type).upgrades;
    }

    protected override replaceBuilding(changes: BuildingUpgradeChanges): void {
        this.ctx.replaceBar(new Bar({
            ...this,
            ...changes,
        }, this.ctx));
    }
}
