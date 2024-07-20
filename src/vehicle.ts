import type { Direction } from './data/direction';
import type { VehicleType } from './data/vehicle-confg';
import { isVehicleData, type VehicleData, type VehicleId } from './data/vehicle-data';
import type { GameContext } from './game-context';
import type { Person } from './person';
import { ResourceStorage } from './resource-storage';
import { generateId } from './utils/random';
import { Wallet } from './wallet';

type CtorArgs = [VehicleData, GameContext] | [
    type: VehicleType,
    position: number,
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [VehicleData, GameContext] {
    return isVehicleData(args[0]);
}

export class Vehicle {
    public readonly id: VehicleId;
    public readonly type: VehicleType;
    public readonly wallet: Wallet;
    public readonly cargo: ResourceStorage;

    private driver_: Person | null;
    private position_: number;
    private drivePoints_: number;
    private route_: Direction[];
    private game: GameContext;

    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data, game] = args;
            this.id = data.id;
            this.type = data.type;
            this.position_ = data.position;
            this.driver_ = data.driverId ? game.person(data.driverId) : null;
            this.wallet = new Wallet(data.money);
            this.cargo = new ResourceStorage(data.cargo, game);
            this.drivePoints_ = data.drivePoints;
            this.route_ = data.route;
            this.game = game;
        } else {
            const [type, position, game] = args;
            this.id = generateId();
            this.type = type;
            this.position_ = position;
            this.driver_ = null;
            this.wallet = new Wallet(0);
            this.cargo = new ResourceStorage(game.vehicleConfig(type).capacity, game);
            this.drivePoints_ = game.vehicleConfig(type).drivePoints;
            this.route_ = [];
            this.game = game;
        }
    }

    public serialize(): VehicleData {
        return {
            id: this.id,
            type: this.type,
            position: this.position_,
            driverId: this.driver_?.id ?? null,
            money: this.wallet.money,
            cargo: this.cargo.serialize(),
            drivePoints: this.drivePoints_,
            route: this.route_,
        };
    }

    public get driver(): Person | null {
        return this.driver_;
    }

    public get position(): number {
        return this.position_;
    }

    public get route(): readonly Direction[] {
        return this.route_;
    }

    public drive(targetPosition: number): void {
        this.route_ = this.game.city.getRoute(this.position, targetPosition);
        this.driveRoute();
    }

    public stop(): void {
        this.route_ = [];
    }

    public update(): void {
        this.driveRoute();
    }

    private driveRoute(): void {
        while (this.route_.length > 0 && this.drivePoints_ > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.position_ = this.game.city.getNextPosition(this.position_, this.route_.shift()!);
            --this.drivePoints_;
        }
    }
}

export interface OccupiedVehicle extends Vehicle {
    driver: Person;
}
