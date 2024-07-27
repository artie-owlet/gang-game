import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../../utils/flavored-string';
import { defineBaseStorageBuildingDataSchema } from './base-storage-building-data';

export const emptyBuildingIdSchema = defineFlavoredStringSchema('EmptyBuildingId');

export type EmptyBuildingId = ss.Infer<typeof emptyBuildingIdSchema>;

export const emptyBuildingDataSchema = ss.intersection([
    defineBaseStorageBuildingDataSchema(emptyBuildingIdSchema),
]);

export type EmptyBuildingData = ss.Infer<typeof emptyBuildingDataSchema>;

export function isEmptyBuildingData(data: unknown): data is EmptyBuildingData {
    return ss.is(data, emptyBuildingDataSchema);
}
