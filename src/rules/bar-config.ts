import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { defineBusinessUpgradeSchema } from './business-upgrade';
import { resourceTypeSchema } from './resource-config';

export const barTypeSchema = defineFlavoredStringSchema('BarType');

export type BarType = ss.Infer<typeof barTypeSchema>;

const barUpgradeSchema = defineBusinessUpgradeSchema(barTypeSchema);

export type BarUpgrade = ss.Infer<typeof barUpgradeSchema>;

export const barConfigSchema = ss.intersection([
    ss.object({
        type: barTypeSchema,
        priceAdd: ss.number(),
        goods: ss.array(ss.object({
            resourceType: resourceTypeSchema,
            salesAmount: ss.number(),
        })),
    }),
    barUpgradeSchema,
]);

export type BarConfig = ss.Infer<typeof barConfigSchema>;
