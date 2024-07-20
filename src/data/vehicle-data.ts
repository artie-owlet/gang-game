import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { directionSchema } from './direction';
import { personIdSchema } from './person-data';
import { resourceStorageSchema } from './resource-storage-data';
import { vehicleTypeSchema } from './vehicle-confg';

export const vehicleIdSchema = defineFlavoredStringSchema('VehicleId');

export type VehicleId = ss.Infer<typeof vehicleIdSchema>;

export const vehicleDataSchema = ss.object({
    id: vehicleIdSchema,
    type: vehicleTypeSchema,
    position: ss.number(),
    driverId: ss.nullable(personIdSchema),
    money: ss.number(),
    cargo: resourceStorageSchema,
    drivePoints: ss.number(),
    route: ss.array(directionSchema),
});

export type VehicleData = ss.Infer<typeof vehicleDataSchema>;

export function isVehicleData(data: unknown): data is VehicleData {
    return ss.is(data, vehicleDataSchema);
}
