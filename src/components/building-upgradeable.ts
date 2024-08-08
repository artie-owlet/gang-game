import ss from 'superstruct';

import type { defineBuildingUpgradeSchema } from '../rules/building-upgrade';
import type { ExtendCtx } from '../utils/create-game-object-class';
import type { Building } from './building';
import type { ResourceStorage } from './resource-storage';
import type { Wallet } from './wallet';

const buildingUpgradeableSchema = ss.object({
    upgradeCountDown: ss.number(),
});

type BuildingUpgradeableData = ss.Infer<typeof buildingUpgradeableSchema>;

interface Context {
    upgrades: () => ss.Infer<ReturnType<typeof defineBuildingUpgradeSchema<string>>>[];
}

type ExtendedContext = ExtendCtx<Context, [Building, ResourceStorage, Wallet]>;

export interface BuildingUpgradeable extends BuildingUpgradeableData, Building, ResourceStorage, Wallet {
    ctx: ExtendedContext;
}

export abstract class BuildingUpgradeable {
    public canUpgradeBuilding(toType: string): boolean {
        const upgrade = this.ctx.upgrades().find((up) => up.toType === toType);
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
        const upgrade = this.ctx.upgrades().find((up) => up.toType === toType)!;
        this.takeMoney(upgrade.money);
        upgrade.resources.forEach((up) => this.takeResource(up.resourceType, up.amount));

        // FIXME: Implement upgrade
    }
}
