import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';

export const vehicleTypeSchema = defineFlavoredStringSchema('VehicleType');

export type VehicleType = ss.Infer<typeof vehicleTypeSchema>;

const vehicleConfigSchema = ss.object({
    capacity: ss.integer(),
    drivePoints: ss.integer(),
});

export type VehicleConfig = ss.Infer<typeof vehicleConfigSchema>;
