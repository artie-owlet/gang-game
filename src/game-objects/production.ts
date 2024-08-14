import ss from 'superstruct';

import { Building, buildingSchema } from '../components/building';
import {
    BuildingUpgradeable,
    defineBuildingUpgradeableSchema,
} from '../components/business-upgradeable';
import { Manageable, manageableSchema } from '../components/manageable';
import { ResourceStorage, resourceStorageSchema } from '../components/resource-storage';
import { Wallet, walletSchema } from '../components/wallet';
import { GangsterPerks } from '../rules/gangster-perks-config';
import {
    productionTypeSchema,
    type ProductionConfig,
    type ProductionType,
    type ProductionUpgrade,
} from '../rules/production-config';
import { productionReceipeTypeSchema, type ProductionReceipe } from '../rules/production-recipe';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { GameObjectClassFactory } from '../utils/game-object-class-factory';
import { recordEntries, recordValue } from '../utils/record-utils';
import type { GameContext } from './game-context';

export const productionIdSchema = defineFlavoredStringSchema('ProductionId');

export type ProductionId = ss.Infer<typeof productionIdSchema>;

const productionPrivateSchema = ss.object({
    id: productionIdSchema,
    type: productionTypeSchema,
    currentReceipeType: ss.nullable(productionReceipeTypeSchema),
    countDown: ss.number(),
});

export const productionSchema = ss.intersection([
    productionPrivateSchema,
    buildingSchema,
    resourceStorageSchema,
    walletSchema,
    manageableSchema,
    defineBuildingUpgradeableSchema('ProductionType'),
]);

type ProductionData = ss.Infer<typeof productionSchema>;

export class Production extends new GameObjectClassFactory(
    Building,
    ResourceStorage,
    Wallet,
    Manageable,
    BuildingUpgradeable<'ProductionType'>,
).create<ProductionData>() {
    public constructor(data: ProductionData, ctx: GameContext) {
        super(data, ctx);
    }

    public update(): void {
        if (this.isUnderConstruction) {
            return;
        }

        if (this.currentReceipe) {
            --this.countDown;
            if (this.countDown === 0) {
                const maxAmount = this.resourceAmountCanAdd(this.currentReceipe.product);
                const amount = this.currentReceipe.amount *
                    (1 + this.getManagerPerkValue(GangsterPerks.prodProductAmountMultAdd));
                if (amount > maxAmount) {
                    this.addResource(this.currentReceipe.product, maxAmount);
                } else {
                    this.addResource(this.currentReceipe.product, amount);
                }
                this.currentReceipeType = null;
            }
        }

        if (!this.currentReceipe) {
            const amountMult = 1 - this.getManagerPerkValue(GangsterPerks.prodInputsAmountMultSub);
            const nextReceipeEntry = recordEntries(this.config.receipes).find(([_, { inputsAmount }]) => {
                return recordEntries(inputsAmount).
                    every(([resourceType, amount]) => this.getResourceAmount(resourceType) >= amount * amountMult);
            });
            if (nextReceipeEntry) {
                this.currentReceipeType = nextReceipeEntry[0];

                const receipe = nextReceipeEntry[1];
                recordEntries(receipe.inputsAmount).
                    forEach(([resourceType, amount]) => this.takeResource(resourceType, amount * amountMult));
                this.countDown = receipe.time - this.getManagerPerkValue(GangsterPerks.prodTimeValueSub);
            }
        }
    }

    protected override getBusinessUpgrade(type: ProductionType): ProductionUpgrade {
        return this.ctx.rules.productionConfig(type);
    }

    protected override onUpgrade(): void {
        this.currentReceipeType = null;
        this.countDown = 0;
    }

    private get config(): ProductionConfig {
        return this.ctx.rules.productionConfig(this.type);
    }

    private get currentReceipe(): ProductionReceipe | null {
        return this.currentReceipeType === null ? null : recordValue(this.config.receipes, this.currentReceipeType);
    }
}
