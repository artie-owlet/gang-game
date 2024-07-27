import ss from 'superstruct';

import type { FlavoredString } from '../../utils/flavored-string';
import { directionSchema } from '../utils/direction';

export function defineBaseVehicleDataSchema<T extends string>(id: ss.Struct<FlavoredString<T>, null>) {
    return ss.object({
        id,
        position: ss.number(),
        drivePoints: ss.number(),
        route: ss.array(directionSchema),
    });
}

const baseVehicleDataSchema = defineBaseVehicleDataSchema(ss.string());

export type BaseVehicleData<T extends string> = ss.Infer<ReturnType<typeof defineBaseVehicleDataSchema<T>>>;

export function isBaseVehicleData<T extends string>(data: unknown): data is BaseVehicleData<T> {
    return ss.is(data, baseVehicleDataSchema);
}
