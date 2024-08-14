import ss from 'superstruct';

import { businessUpgradeCost, type BusinessUpgrade } from '../rules/business-upgrade';
import { defineFlavoredStringSchema, type FlavoredString } from '../utils/flavored-string';
import { updateComponent } from '../utils/game-object-class-factory';
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
        const current = this.getBusinessUpgrade(this.type);
        if (!current.upgrades.includes(toType)) {
            return false;
        }

        const target = this.getBusinessUpgrade(toType);

        const upgradeCost = businessUpgradeCost(current.buildingCost, target.buildingCost);
        if (this.money < upgradeCost.money) {
            return false;
        }
        if (upgradeCost.resources.some((res) => !this.canTakeAmount(res.resourceType, res.amount))) {
            return false;
        }

        return true;
    }

    public upgradeBuilding(toType: FlavoredString<T>): void {
        if (!this.canUpgradeBuilding(toType)) {
            throw new Error(`Cannot upgrade building to type ${toType}`);
        }

        const current = this.getBusinessUpgrade(this.type);
        const target = this.getBusinessUpgrade(toType);

        const upgradeCost = businessUpgradeCost(current.buildingCost, target.buildingCost);
        this.takeMoney(upgradeCost.money);
        upgradeCost.resources.forEach((up) => this.takeResource(up.resourceType, up.amount));
        this.upgradeCountDown = upgradeCost.buildingTime;

        this.onUpgrade();
    }

    public [updateComponent](): void {
        if (this.upgradeCountDown > 0) {
            --this.upgradeCountDown;
        }
    }

    protected abstract getBusinessUpgrade(type: FlavoredString<T>): BusinessUpgrade<T>;

    protected abstract onUpgrade(): void;
}
