import ss from 'superstruct';

import { type FlavoredString } from '../../utils/flavored-string';
import { defineBaseBuildingDataSchema } from './base-building-data';
import { resourceStorageSchema } from './resource-storage-data';

export function defineBaseStorageBuildingDataSchema<T extends string>(id: ss.Struct<FlavoredString<T>, null>) {
    return ss.intersection([
        defineBaseBuildingDataSchema(id),
        ss.object({
            money: ss.number(),
            storage: resourceStorageSchema,
        }),
    ]);
}

const baseStorageBuildingDataSchema = defineBaseStorageBuildingDataSchema(ss.string());

export type BaseStorageBuildingData<T extends string> =
    ss.Infer<ReturnType<typeof defineBaseStorageBuildingDataSchema<T>>>;

export function isBaseStorageBuildingData<T extends string>(data: unknown): data is BaseStorageBuildingData<T> {
    return ss.is(data, baseStorageBuildingDataSchema);
}
