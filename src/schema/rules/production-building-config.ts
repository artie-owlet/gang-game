import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../../utils/flavored-string';
import { resourceTypeSchema } from './resource-config';

export const productionBuildingTypeSchema = defineFlavoredStringSchema('ProductionBuildingType');

export type ProductionBuildingType = ss.Infer<typeof productionBuildingTypeSchema>;

export const productionReceipeSchema = ss.object({
    inputs: ss.array(ss.object({
        resourceType: resourceTypeSchema,
        amount: ss.number(),
    })),
    product: ss.object({
        resourceType: resourceTypeSchema,
        amount: ss.number(),
    }),
    time: ss.number(),
});

export type ProductionReceipe = ss.Infer<typeof productionReceipeSchema>;

export const productionBuildingConfigSchema = ss.object({
    type: productionBuildingTypeSchema,
    receipes: ss.array(productionReceipeSchema),
});

export type ProductionBuildingConfig = ss.Infer<typeof productionBuildingConfigSchema>;
