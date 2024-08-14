import ss from 'superstruct';

import { Building, buildingSchema } from '../components/building';
import {
    BuildingUpgradeable,
    defineBuildingUpgradeableSchema,
} from '../components/business-upgradeable';
import { Manageable, manageableSchema } from '../components/manageable';
import { ResourceStorage, resourceStorageSchema } from '../components/resource-storage';
import { Wallet, walletSchema } from '../components/wallet';
import { barTypeSchema, type BarConfig, type BarType, type BarUpgrade } from '../rules/bar-config';
import { GangsterPerks } from '../rules/gangster-perks-config';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { GameObjectClassFactory } from '../utils/game-object-class-factory';
import { recordEntries } from '../utils/record-utils';
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

export class Bar extends new GameObjectClassFactory(
    Building,
    ResourceStorage,
    Wallet,
    Manageable,
    BuildingUpgradeable<'BarType'>,
).create<BarData>() {
    public constructor(data: BarData, ctx: GameContext) {
        super(data, ctx);
    }

    public update(): void {
        if (this.isUnderConstruction) {
            return;
        }

        const amountMult = 1 + this.getManagerPerkValue(GangsterPerks.barAmountMultAdd);
        const priceMult = 1 + this.config.priceMultAdd + this.getManagerPerkValue(GangsterPerks.barPriceMultAdd);

        recordEntries(this.config.goodsSalesAmount).forEach(([resourceType, salesAmount]) => {
            const maxAmount = this.getResourceAmount(resourceType);
            if (maxAmount === 0) {
                return;
            }

            const amount = salesAmount * amountMult;
            const price = this.ctx.rules.resourceConfig(resourceType).price * priceMult;
            if (amount > maxAmount) {
                this.takeResource(resourceType, maxAmount);
                this.addMoney(maxAmount * price);
            } else {
                this.takeResource(resourceType, amount);
                this.addMoney(amount * price);
            }
        });
    }

    protected override getBusinessUpgrade(type: BarType): BarUpgrade {
        return this.ctx.rules.barConfig(type);
    }

    protected override onUpgrade(): void {
    }

    private get config(): BarConfig {
        return this.ctx.rules.barConfig(this.type);
    }
}
