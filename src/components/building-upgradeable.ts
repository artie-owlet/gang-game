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

export interface BuildingUpgradeable extends BuildingUpgradeableData, Building, ResourceStorage, Wallet {
    ctx: ExtendCtx<Context, [typeof Building, typeof ResourceStorage, typeof Wallet]>;
}

export abstract class BuildingUpgradeable {
    public canUpgrade(toType: string): boolean {
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

    public upgrade(toType: string): void {
    }
}
