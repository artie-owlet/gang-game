import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { resourceStorageSchema } from './resource-storage-data';

export const buildingIdSchema = defineFlavoredStringSchema('BuildingId');

export type BuildingId = ss.Infer<typeof buildingIdSchema>;

export const emptyBuildingDataSchema = ss.object({
    id: buildingIdSchema,
    name: ss.string(),
    money: ss.number(),
    storage: resourceStorageSchema,
});

export type EmptyBuildingData = ss.Infer<typeof emptyBuildingDataSchema>;

export function isEmptyBuildingData(data: unknown): data is EmptyBuildingData {
    return ss.is(data, emptyBuildingDataSchema);
}
