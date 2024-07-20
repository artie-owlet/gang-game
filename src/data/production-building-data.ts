import ss from 'superstruct';

import { emptyBuildingDataSchema } from './empty-building-data';
import { personIdSchema } from './person-data';
import { productionReceipeSchema, productionBuildingTypeSchema } from './production-building-config';

export const productionBuildingDataSchema = ss.intersection([
    emptyBuildingDataSchema,
    ss.object({
        type: productionBuildingTypeSchema,
        managerId: ss.nullable(personIdSchema),
        currentReceipe: ss.nullable(productionReceipeSchema),
        countDown: ss.number(),
    }),
]);

export type ProductionBuildingData = ss.Infer<typeof productionBuildingDataSchema>;

export function isProductionBuildingData(data: unknown): data is ProductionBuildingData {
    return ss.is(data, productionBuildingDataSchema);
}
