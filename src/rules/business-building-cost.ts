import ss from 'superstruct';

import { resourceTypeSchema } from './resource-config';

export const businessBuildingCostSchema = ss.object({
    money: ss.number(),
    resources: ss.array(ss.object({
        resourceType: resourceTypeSchema,
        amount: ss.number(),
    })),
    buildingTime: ss.number(),
});

export type BusinessBuildingCost = ss.Infer<typeof businessBuildingCostSchema>;
