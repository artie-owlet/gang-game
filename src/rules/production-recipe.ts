import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { resourceTypeSchema } from './resource-config';

export const productionReceipeTypeSchema = defineFlavoredStringSchema('ProductionRecipeType');

export type ProductionReceipeType = ss.Infer<typeof productionReceipeTypeSchema>;

export const productionReceipeSchema = ss.object({
    product: resourceTypeSchema,
    amount: ss.number(),
    inputsAmount: ss.record(resourceTypeSchema, ss.number()),
    time: ss.number(),
});

export type ProductionReceipe = ss.Infer<typeof productionReceipeSchema>;
