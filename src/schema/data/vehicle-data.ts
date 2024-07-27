import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../../utils/flavored-string';
import { vehicleTypeSchema } from '../rules/vehicle-confg';
import { defineBaseVehicleDataSchema } from './base-vehicle-data';
import { gangsterIdSchema } from './gangster-data';
import { resourceStorageSchema } from './resource-storage-data';

export const vehicleIdSchema = defineFlavoredStringSchema('VehicleId');

export type VehicleId = ss.Infer<typeof vehicleIdSchema>;

export const vehicleDataSchema = ss.intersection([
    defineBaseVehicleDataSchema(vehicleIdSchema),
    ss.object({
        type: vehicleTypeSchema,
        driverId: ss.nullable(gangsterIdSchema),
        money: ss.number(),
        cargo: resourceStorageSchema,
    }),
]);

export type VehicleData = ss.Infer<typeof vehicleDataSchema>;

export function isVehicleData(data: unknown): data is VehicleData {
    return ss.is(data, vehicleDataSchema);
}
