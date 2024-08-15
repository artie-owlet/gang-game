import ss from 'superstruct';

import { ResourceStorage, resourceStorageSchema } from '../components/resource-storage';
import { Vehicle, defineVehicleSchema } from '../components/vehicle';
import { Wallet, walletSchema } from '../components/wallet';
import { GangsterPerks } from '../rules/gangster-perks-config';
import type { VehicleType } from '../rules/vehicle-config';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { GameObjectClassFactory } from '../utils/game-object-class-factory';
import { generateId } from '../utils/random';
import type { GameContext } from './game-context';
import type { Gangster } from './gangster';

export const gangsterVehicleIdSchema = defineFlavoredStringSchema('GangsterVehicleId');

export type GangsterVehicleId = ss.Infer<typeof gangsterVehicleIdSchema>;

export const gangsterVehicleSchema = ss.intersection([
    ss.object({ id: gangsterVehicleIdSchema }),
    defineVehicleSchema('GangsterId'),
    walletSchema,
    resourceStorageSchema,
]);

export class GangsterVehicle extends new GameObjectClassFactory(
    Vehicle,
    Wallet,
    ResourceStorage,
).create<ss.Infer<typeof gangsterVehicleSchema>>() {
    public static create(type: VehicleType, position: number, ctx: GameContext): GangsterVehicle {
        return new GangsterVehicle({
            id: generateId(),
            ...Vehicle.create(type, position),
            ...ResourceStorage.create(ctx.rules.vehicleConfig(type).capacity),
            ...Wallet.create(),
        }, ctx);
    }

    public get driver(): Gangster | null {
        return this.driverId !== null ? this.ctx.gangster(this.driverId) : null;
    }

    public override get drivePointsTotal(): number {
        if (this.driver) {
            return super.drivePointsTotal + this.driver.getPerkValue(GangsterPerks.driverDrivePointsAddValue);
        }
        return super.drivePointsTotal;
    }
}
