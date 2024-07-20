import ss from 'superstruct';

import { barBuildingTypeSchema } from './bar-building-config';
import { emptyBuildingDataSchema } from './empty-building-data';
import { personIdSchema } from './person-data';

export const barBuildingDataSchema = ss.intersection([
    emptyBuildingDataSchema,
    ss.object({
        type: barBuildingTypeSchema,
        managerId: ss.nullable(personIdSchema),
    }),
]);

export type BarBuildingData = ss.Infer<typeof barBuildingDataSchema>;

export function isBarBuildingData(data: unknown): data is BarBuildingData {
    return ss.is(data, barBuildingDataSchema);
}
