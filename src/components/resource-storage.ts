import ss from 'superstruct';

import { resourceTypeSchema } from '../rules/resource-config';

export const resourceStorageItemSchema = ss.object({
    resourceType: resourceTypeSchema,
    amount: ss.number(),
});

export type ResourceStorageItem = ss.Infer<typeof resourceStorageItemSchema>;

export const resourceStorageSchema = ss.object({
    capacity: ss.number(),
    items: ss.array(resourceStorageItemSchema),
});

export interface ResourceStorage extends ss.Infer<typeof resourceStorageSchema> {}

export abstract class ResourceStorage {
}
