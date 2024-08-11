import ss from 'superstruct';

import type { BuildingUpgrade } from '../rules/building-upgrade';
import { updateComponent } from '../utils/create-game-object-class';
import { defineFlavoredStringSchema, type FlavoredString } from '../utils/flavored-string';
import type { Building } from './building';
import type { ResourceStorage } from './resource-storage';
import type { Wallet } from './wallet';

export function defineBuildingUpgradeableSchema<T extends string>(typename: T) {
    return ss.object({
        type: defineFlavoredStringSchema(typename),
        upgradeCountDown: ss.number(),
    });
}

type BuildingUpgradeableData<T extends string> = ss.Infer<ReturnType<typeof defineBuildingUpgradeableSchema<T>>>;

export interface BuildingUpgradeable<T extends string> extends
    BuildingUpgradeableData<T>, Building, ResourceStorage, Wallet {
}

export abstract class BuildingUpgradeable<T extends string> {
    public get isUnderConstruction(): boolean {
        return this.upgradeCountDown > 0;
    }

    public canUpgradeBuilding(toType: FlavoredString<T>): boolean {
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

    public upgradeBuilding(toType: FlavoredString<T>): void {
        if (!this.canUpgradeBuilding(toType)) {
            throw new Error(`Cannot upgrade building to type ${toType}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const upgrade = this.getBuildingUpgrades().find((up) => up.toType === toType)!;
        this.takeMoney(upgrade.money);
        upgrade.resources.forEach((up) => this.takeResource(up.resourceType, up.amount));
        this.onUpgrade();
    }

    public [updateComponent](): void {
        if (this.upgradeCountDown > 0) {
            --this.upgradeCountDown;
        }
    }

    protected abstract getBuildingUpgrades(): BuildingUpgrade<T>[];

    protected abstract onUpgrade(): void;
}
