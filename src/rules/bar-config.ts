import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { defineBuildingUpgradeSchema } from './building-upgrade';
import { resourceTypeSchema } from './resource-config';

export const barTypeSchema = defineFlavoredStringSchema('BarBuildingType');

export type BarType = ss.Infer<typeof barTypeSchema>;

const barUpgradeSchema = defineBuildingUpgradeSchema(barTypeSchema);

export const barConfigSchema = ss.object({
    type: barTypeSchema,
    priceMult: ss.number(),
    goods: ss.array(ss.object({
        resourceType: resourceTypeSchema,
        amount: ss.number(),
    })),
    upgrades: ss.array(barUpgradeSchema),
});

export type BarConfig = ss.Infer<typeof barConfigSchema>;
