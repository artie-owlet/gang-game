import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';

export const vehicleTypeSchema = defineFlavoredStringSchema('VehicleType');

export type VehicleType = ss.Infer<typeof vehicleTypeSchema>;

const vehicleConfigSchema = ss.object({
    capacity: ss.number(),
    drivePoints: ss.number(),
});

export type VehicleConfig = ss.Infer<typeof vehicleConfigSchema>;
