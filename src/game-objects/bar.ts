import ss from 'superstruct';

import { buildingSchema } from '../components/building';
import { manageableSchema } from '../components/manageable';
import { barTypeSchema } from '../rules/bar-config';
import { createBaseClass } from '../utils/create-base-class';
import { defineFlavoredStringSchema } from '../utils/flavored-string';

export const barIdSchema = defineFlavoredStringSchema('BarId');

export type BarId = ss.Infer<typeof barIdSchema>;

const barPrivateSchema = ss.object({
    id: barIdSchema,
    type: barTypeSchema,
});

export const barSchema = ss.intersection([
    barPrivateSchema,
    buildingSchema,
    manageableSchema,
]);
