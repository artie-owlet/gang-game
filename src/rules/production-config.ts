import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { defineBusinessUpgradeSchema } from './business-upgrade';
import { productionReceipeSchema, productionReceipeTypeSchema } from './production-recipe';

export const productionTypeSchema = defineFlavoredStringSchema('ProductionType');

export type ProductionType = ss.Infer<typeof productionTypeSchema>;

const productionUpgradeSchema = defineBusinessUpgradeSchema(productionTypeSchema);

export type ProductionUpgrade = ss.Infer<typeof productionUpgradeSchema>;

export const productionConfigSchema = ss.intersection([
    ss.object({
        receipes: ss.record(productionReceipeTypeSchema, productionReceipeSchema),
    }),
    productionUpgradeSchema,
]);

export type ProductionConfig = ss.Infer<typeof productionConfigSchema>;
