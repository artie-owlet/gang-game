import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../../utils/flavored-string';
import { barBuildingTypeSchema } from '../rules/bar-building-config';
import { defineBaseStorageBuildingDataSchema } from './base-storage-building-data';
import { gangsterIdSchema } from './gangster-data';

export const barBuildingIdSchema = defineFlavoredStringSchema('BarBuildingId');

export type BarBuildingId = ss.Infer<typeof barBuildingIdSchema>;

export const barBuildingDataSchema = ss.intersection([
    defineBaseStorageBuildingDataSchema(barBuildingIdSchema),
    ss.object({
        type: barBuildingTypeSchema,
        managerId: ss.nullable(gangsterIdSchema),
    }),
]);

export type BarBuildingData = ss.Infer<typeof barBuildingDataSchema>;

export function isBarBuildingData(data: unknown): data is BarBuildingData {
    return ss.is(data, barBuildingDataSchema);
}
