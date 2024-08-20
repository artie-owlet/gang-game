import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { vehicleTypeSchema } from './vehicle-config';

export const autoDealerTypeSchema = defineFlavoredStringSchema('AutoDealerType');

export type AutoDealerType = ss.Infer<typeof autoDealerTypeSchema>;

export const autoDealerConfigSchema = ss.object({
    vehicleTypes: ss.array(vehicleTypeSchema),
    canSellVehicle: ss.boolean(),
});

export type AutoDealerConfig = ss.Infer<typeof autoDealerConfigSchema>;
