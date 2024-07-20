import ss, { type Infer } from 'superstruct';

import { defineFlavoredStringSchema } from '../../utils/flavored-string';

export const vehicleTypeSchema = defineFlavoredStringSchema('VehicleType');

export type VehicleType = Infer<typeof vehicleTypeSchema>;

const vehicleConfigSchema = ss.object({
    type: vehicleTypeSchema,
    capacity: ss.number(),
    drivePoints: ss.number(),
});

export type VehicleConfig = ss.Infer<typeof vehicleConfigSchema>;
