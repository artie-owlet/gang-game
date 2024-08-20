import ss from 'superstruct';

import { vehicleTypeSchema, type VehicleType } from '../rules/vehicle-config';
import { updateComponent } from '../utils/game-object-class-factory';

const vehicleItemSchema = ss.object({
    maxNumber: ss.integer(),
    updateInterval: ss.integer(),
    updateNumber: ss.integer(),
    number: ss.integer(),
    updateCountDown: ss.integer(),
});

export const autoDealerSchema = ss.object({
    vehicleItems: ss.map(vehicleTypeSchema, vehicleItemSchema),
    canSellVehicle: ss.boolean(),
});

type AutoDealerData = ss.Infer<typeof autoDealerSchema>;

export interface AutoDealer extends AutoDealerData {
}

export abstract class AutoDealer {
    public get isAutoDealer(): boolean {
        return this.vehicleItems.size > 0 || this.canSellVehicle;
    }

    public get availableVehicles(): VehicleType[] {
        return Array.from(this.vehicleItems.entries()).
            filter(([, item]) => item.number > 0).
            map(([type]) => type);
    }

    public buyVehicle(type: VehicleType): void {
        const item = this.vehicleItems.get(type);
        if (!item || item.number === 0) {
            throw new Error('Cannot buy vehicle');
        }
        --item.number;
    }

    public [updateComponent](): void {
        for (const item of this.vehicleItems.values()) {
            --item.updateCountDown;
            if (item.updateCountDown > 0) {
                continue;
            }

            item.updateCountDown = item.updateInterval;
            item.number += item.updateNumber;
            if (item.number > item.maxNumber) {
                item.number = item.maxNumber;
            }
        }
    }
}
