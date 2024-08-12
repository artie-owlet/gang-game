import ss from 'superstruct';

import type { FlavoredStringSchema } from '../utils/flavored-string';
import { businessBuildingCostSchema, type BusinessBuildingCost } from './business-building-cost';

export function defineBusinessUpgradeSchema<T extends string>(typeSchema: FlavoredStringSchema<T>) {
    return ss.object({
        type: typeSchema,
        buildingCost: businessBuildingCostSchema,
        upgrades: ss.array(typeSchema),
    });
}

export type BusinessUpgrade<T extends string> = ss.Infer<ReturnType<typeof defineBusinessUpgradeSchema<T>>>;

export function businessUpgradeCost(from: BusinessBuildingCost, to: BusinessBuildingCost): BusinessBuildingCost {
    const money = to.money - (from.money / 2 | 0);
    const resources = to.resources.map(({ resourceType, amount }) => {
        const fromAmount = from.resources.find((item) => item.resourceType === resourceType)?.amount ?? 0;
        return {
            resourceType,
            amount: amount - (fromAmount / 2 | 0),
        };
    });
    return {
        money,
        resources,
        buildingTime: to.buildingTime,
    };
}
