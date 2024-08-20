import ss from 'superstruct';

import type { GameContext } from '../game-objects/game-context';
import type { AutoDealerType } from '../rules/auto-dealer-config';
import { vehicleTypeSchema, type VehicleType } from '../rules/vehicle-config';
import { updateComponent } from '../utils/game-object-class-factory';
import { JsonMap } from '../utils/json-tools';
import { randomFromSet } from '../utils/random';

const vehicleItemSchema = ss.object({
    maxNumber: ss.integer(),
    updateInterval: ss.integer(),
    updateNumber: ss.integer(),
    number: ss.integer(),
    updateCountDown: ss.integer(),
});

type VehicleItem = ss.Infer<typeof vehicleItemSchema>;

export const autoDealerSchema = ss.object({
    vehicleItems: ss.map(vehicleTypeSchema, vehicleItemSchema),
    canSellVehicle: ss.boolean(),
});

type AutoDealerData = ss.Infer<typeof autoDealerSchema>;

export interface AutoDealer extends AutoDealerData {
}

export abstract class AutoDealer {
    public static create(autoDealerType: AutoDealerType, ctx: GameContext): AutoDealerData;
    public static create(): AutoDealerData;
    public static create(...args: [AutoDealerType, GameContext] | []): AutoDealerData {
        if (args.length === 0) {
            return {
                vehicleItems: new JsonMap(),
                canSellVehicle: false,
            };
        }

        const [autoDealerType, ctx] = args;
        const config = ctx.rules.autoDealerConfig(autoDealerType);
        return {
            vehicleItems: config.vehicleTypes.reduce((items, vehicleType) => {
                const { dealership } = ctx.rules.vehicleConfig(vehicleType);
                const maxNumber = randomFromSet(dealership.maxNumber, ctx.randomizer.rng);
                const updateInterval = randomFromSet(dealership.updateInterval, ctx.randomizer.rng);
                const updateNumber = randomFromSet(dealership.updateNumber, ctx.randomizer.rng);

                items.set(vehicleType, {
                    maxNumber,
                    updateInterval,
                    updateNumber,
                    number: maxNumber,
                    updateCountDown: updateInterval,
                });
                return items;
            }, new JsonMap<VehicleType, VehicleItem>()),
            canSellVehicle: config.canSellVehicle,
        };
    }

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
