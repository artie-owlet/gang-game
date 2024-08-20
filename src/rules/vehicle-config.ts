import ss from 'superstruct';

import { weightedSetSchema } from '../common-type-schemas/weighted-set';
import { defineFlavoredStringSchema } from '../utils/flavored-string';

export const vehicleTypeSchema = defineFlavoredStringSchema('VehicleType');

export type VehicleType = ss.Infer<typeof vehicleTypeSchema>;

const vehicleConfigSchema = ss.object({
    capacity: ss.integer(),
    drivePoints: ss.integer(),
    buyPrice: ss.number(),
    salePrice: ss.number(),
    dealership: ss.object({
        maxNumber: weightedSetSchema,
        updateInterval: weightedSetSchema,
        updateNumber: weightedSetSchema,
    }),
});

export type VehicleConfig = ss.Infer<typeof vehicleConfigSchema>;
