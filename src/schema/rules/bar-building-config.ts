import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../../utils/flavored-string';
import { resourceTypeSchema } from './resource-config';

export const barBuildingTypeSchema = defineFlavoredStringSchema('BarBuildingType');

export type BarBuildingType = ss.Infer<typeof barBuildingTypeSchema>;

export const barBuildingConfigSchema = ss.object({
    type: barBuildingTypeSchema,
    goods: ss.array(ss.object({
        resourceType: resourceTypeSchema,
        amount: ss.number(),
        price: ss.number(),
    })),
});

export type BarBuildingConfig = ss.Infer<typeof barBuildingConfigSchema>;
