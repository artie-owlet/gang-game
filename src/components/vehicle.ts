import ss from 'superstruct';

import { directionSchema } from '../common-type-schemas/direction';
import { vehicleTypeSchema, type VehicleType } from '../rules/vehicle-config';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { updateComponent } from '../utils/game-object-class-factory';
import type { WithContext } from './with-context';

export function defineVehicleSchema<T extends string>(driverIdTypename: T) {
    return ss.object({
        type: vehicleTypeSchema,
        driverId: ss.nullable(defineFlavoredStringSchema(driverIdTypename)),
        position: ss.number(),
        route: ss.array(directionSchema),
        driven: ss.number(),
    });
}

type VehicleData<T extends string> = ss.Infer<ReturnType<typeof defineVehicleSchema<T>>>;

export interface Vehicle<T extends string> extends VehicleData<T>, WithContext {
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class Vehicle<T extends string> {
    public static create<T extends string>(type: VehicleType, position: number): VehicleData<T> {
        return {
            type,
            driverId: null,
            position,
            route: [],
            driven: 0,
        };
    }

    public get drivePointsTotal(): number {
        return this.ctx.rules.vehicleConfig(this.type).drivePoints;
    }

    public get drivePointsLeft(): number {
        const left = this.drivePointsTotal - this.driven;
        return left > 0 ? left : 0;
    }

    public driveTo(position: number): void {
        this.route = this.ctx.streetMap.getRoute(this.position, position);
        this.driveRoute();
    }

    public [updateComponent]() {
        this.driven = 0;
        this.driveRoute();
    }

    private driveRoute(): void {
        while (this.route.length > 0 && this.drivePointsLeft > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.position = this.ctx.streetMap.getNextPosition(this.position, this.route.shift()!);
            ++this.driven;
        }
    }
}
