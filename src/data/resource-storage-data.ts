import ss from 'superstruct';

import { resourceTypeSchema } from './resource-config';

export const resourceStorageItemSchema = ss.object({
    resourceType: resourceTypeSchema,
    amount: ss.number(),
});

export type ResourceStorageItem = ss.Infer<typeof resourceStorageItemSchema>;

export const resourceStorageSchema = ss.object({
    capacity: ss.number(),
    items: ss.array(resourceStorageItemSchema),
});

export type ResourceStorageData = ss.Infer<typeof resourceStorageSchema>;

export function isResourceStorageData(data: unknown): data is ResourceStorageData {
    return ss.is(data, resourceStorageSchema);
}
