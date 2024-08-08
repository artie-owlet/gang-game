import ss from 'superstruct';

import type { defineBuildingUpgradeSchema } from '../rules/building-upgrade';
import type { Building } from './building';
import type { ResourceStorage } from './resource-storage';
import type { Wallet } from './wallet';

export const buildingUpgradeableSchema = ss.object({
    type: ss.string(),
    upgradeCountDown: ss.number(),
});

type BuildingUpgradeableData = ss.Infer<typeof buildingUpgradeableSchema>;

export interface BuildingUpgradeable extends BuildingUpgradeableData, Building, ResourceStorage, Wallet {
}

export type BuildingUpgradeChanges = Pick<BuildingUpgradeable, 'type' | 'upgradeCountDown'>;

export abstract class BuildingUpgradeable {
    public get isUnderConstruction(): boolean {
        return this.upgradeCountDown > 0;
    }

    public canUpgradeBuilding(toType: string): boolean {
        const upgrade = this.getBuildingUpgrades().find((up) => up.toType === toType);
        if (!upgrade) {
            return false;
        }

        if (this.money < upgrade.money) {
            return false;
        }
        if (upgrade.resources.some((res) => !this.canTakeAmount(res.resourceType, res.amount))) {
            return false;
        }

        return true;
    }

    public upgradeBuilding(toType: string): void {
        if (!this.canUpgradeBuilding(toType)) {
            throw new Error(`Cannot upgrade building to type ${toType}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const upgrade = this.getBuildingUpgrades().find((up) => up.toType === toType)!;
        this.takeMoney(upgrade.money);
        upgrade.resources.forEach((up) => this.takeResource(up.resourceType, up.amount));

        this.replaceBuilding({
            type: toType,
            upgradeCountDown: upgrade.time,
        });
    }

    protected abstract getBuildingUpgrades(): ss.Infer<ReturnType<typeof defineBuildingUpgradeSchema<string>>>[];

    protected abstract replaceBuilding(changes: BuildingUpgradeChanges): void;
}
