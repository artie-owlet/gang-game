import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { defineBuildingUpgradeSchema } from './building-upgrade';
import { resourceTypeSchema } from './resource-config';

export const barTypeSchema = defineFlavoredStringSchema('BarType');

export type BarType = ss.Infer<typeof barTypeSchema>;

const barUpgradeSchema = defineBuildingUpgradeSchema(barTypeSchema);

export type BarUpgrade = ss.Infer<typeof barUpgradeSchema>;

export const barConfigSchema = ss.object({
    type: barTypeSchema,
    priceAdd: ss.number(),
    goods: ss.array(ss.object({
        resourceType: resourceTypeSchema,
        salesAmount: ss.number(),
    })),
    upgrades: ss.array(barUpgradeSchema),
});

export type BarConfig = ss.Infer<typeof barConfigSchema>;
