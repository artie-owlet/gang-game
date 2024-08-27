import ss from 'superstruct';

import { Building, buildingSchema } from '../components/building';
import { ResourceStorage, resourceStorageSchema } from '../components/resource-storage';
import { Wallet, walletSchema } from '../components/wallet';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { GameObjectClassFactory } from '../utils/game-object-class-factory';
import type { EmptyBuilding } from './empty-building';
import type { GameContext } from './game-context';

export const warehouseIdSchema = defineFlavoredStringSchema('WarehouseId');

export type WarehouseId = ss.Infer<typeof warehouseIdSchema>;

export const warehouseSchema = ss.intersection([
    ss.object({ id: warehouseIdSchema }),
    buildingSchema,
    resourceStorageSchema,
    walletSchema,
]);

export class Warehouse extends new GameObjectClassFactory(
    Building,
    ResourceStorage,
    Wallet,
).create<ss.Infer<typeof warehouseSchema>>() {
    public static create(building: EmptyBuilding, ctx: GameContext): Warehouse {
        const warehouse = new Warehouse({
            ...building,
            id: <WarehouseId>building.id,
        }, ctx);
        warehouse.storageCapacity = ctx.rules.generalConfig.warehouseCapacity;
        ctx.buildWarehouse(warehouse);
        return warehouse;
    }
}
