import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../../utils/flavored-string';
import { productionReceipeSchema, productionBuildingTypeSchema } from '../rules/production-building-config';
import { defineBaseStorageBuildingDataSchema } from './base-storage-building-data';
import { gangsterIdSchema } from './gangster-data';

export const productionBuildingIdSchema = defineFlavoredStringSchema('ProductionBuildingId');

export type ProductionBuildingId = ss.Infer<typeof productionBuildingIdSchema>;

export const productionBuildingDataSchema = ss.intersection([
    defineBaseStorageBuildingDataSchema(productionBuildingIdSchema),
    ss.object({
        type: productionBuildingTypeSchema,
        managerId: ss.nullable(gangsterIdSchema),
        currentReceipe: ss.nullable(productionReceipeSchema),
        countDown: ss.number(),
    }),
]);

export type ProductionBuildingData = ss.Infer<typeof productionBuildingDataSchema>;

export function isProductionBuildingData(data: unknown): data is ProductionBuildingData {
    return ss.is(data, productionBuildingDataSchema);
}
