import ss from 'superstruct';

import type { FlavoredString } from '../utils/flavored-string';
import { resourceTypeSchema } from './resource-config';

export function defineBuildingUpgradeSchema<T extends string>(toType: ss.Struct<FlavoredString<T>, null>) {
    return ss.object({
        toType,
        money: ss.number(),
        resources: ss.array(ss.object({
            resourceType: resourceTypeSchema,
            amount: ss.number(),
        })),
        time: ss.number(),
    });
}
