import { BaseVehicle } from './base-vehicle';
import type { GameContext } from './game-context';
import type { Gangster } from './gangster';
import { ResourceStorage } from './resource-storage';
import { isVehicleData, type VehicleData } from './schema/data/vehicle-data';
import type { VehicleType } from './schema/rules/vehicle-confg';
import { Wallet } from './wallet';

type CtorArgs = [VehicleData, GameContext] | [
    type: VehicleType,
    position: number,
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [VehicleData, GameContext] {
    return isVehicleData(args[0]);
}

export class Vehicle extends BaseVehicle<'VehicleId'> {
    public readonly type: VehicleType;
    public readonly wallet: Wallet;
    public readonly cargo: ResourceStorage;

    private driver_: Gangster | null;

    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data, game] = args;
            super(data, game);
            this.type = data.type;
            this.driver_ = data.driverId ? game.gangster(data.driverId) : null;
            this.wallet = new Wallet(data.money);
            this.cargo = new ResourceStorage(data.cargo, game);
        } else {
            const [type, position, game] = args;
            super(position, game);
            this.type = type;
            this.driver_ = null;
            this.wallet = new Wallet(0);
            this.cargo = new ResourceStorage(game.rules.vehicleConfig(type).capacity, game);
        }
    }

    public override serialize(): VehicleData {
        return {
            ...super.serialize(),
            type: this.type,
            driverId: this.driver_?.id ?? null,
            money: this.wallet.money,
            cargo: this.cargo.serialize(),
        };
    }

    public get driver(): Gangster | null {
        return this.driver_;
    }

    protected override get maxDrivePoints(): number {
        return this.game.rules.vehicleConfig(this.type).drivePoints;
    }
}

export interface OccupiedVehicle extends Vehicle {
    driver: Gangster;
}
