import type { GameContext } from './game-context';
import { isBaseVehicleData, type BaseVehicleData } from './schema/data/base-vehicle-data';
import type { Direction } from './schema/utils/direction';
import type { FlavoredString } from './utils/flavored-string';
import { generateId } from './utils/random';

type CtorArgs<T extends string> = [BaseVehicleData<T>, GameContext] | [
    position: number,
    game: GameContext,
];

function isLoadCtorArgs<T extends string>(args: CtorArgs<T>): args is [BaseVehicleData<T>, GameContext] {
    return isBaseVehicleData(args[0]);
}

export abstract class BaseVehicle<T extends string> {
    public readonly id: FlavoredString<T>;

    protected game: GameContext;

    private position_: number;
    private drivePoints_: number;
    private route_: Direction[];

    public constructor(...args: CtorArgs<T>) {
        if (isLoadCtorArgs(args)) {
            const [data, game] = args;
            this.id = data.id;
            this.position_ = data.position;
            this.drivePoints_ = data.drivePoints;
            this.route_ = data.route;
            this.game = game;
        } else {
            const [position, game] = args;
            this.id = generateId();
            this.position_ = position;
            this.drivePoints_ = 0;
            this.route_ = [];
            this.game = game;
        }
    }

    public serialize(): BaseVehicleData<T> {
        return {
            id: this.id,
            position: this.position_,
            drivePoints: this.drivePoints_,
            route: this.route_,
        };
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
        this.drivePoints_ = this.maxDrivePoints;
        this.driveRoute();
    }

    private driveRoute(): void {
        while (this.route_.length > 0 && this.drivePoints_ > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.position_ = this.game.city.getNextPosition(this.position_, this.route_.shift()!);
            --this.drivePoints_;
        }
    }

    protected abstract get maxDrivePoints(): number;
}
