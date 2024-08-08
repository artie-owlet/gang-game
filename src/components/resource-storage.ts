import ss from 'superstruct';

import type { Rules } from '../game-objects/game-context';
import { resourceTypeSchema, type ResourceType } from '../rules/resource-config';

const resourceStorageItemSchema = ss.object({
    resourceType: resourceTypeSchema,
    amount: ss.number(),
});

export type ResourceStorageItem = ss.Infer<typeof resourceStorageItemSchema>;

export const resourceStorageSchema = ss.object({
    storageCapacity: ss.number(),
    storageItems: ss.array(resourceStorageItemSchema),
});

type ResourceStorageData = ss.Infer<typeof resourceStorageSchema>;

export interface ResourceStorage extends ResourceStorageData {
}

export abstract class ResourceStorage {
    public get storageTotalSize(): number {
        return this.storageItems.reduce((acc, item) => {
            return acc + item.amount * this.getResourceUnitSize(item.resourceType);
        }, 0);
    }

    public canAddAmount(resourceType: ResourceType): number {
        return (this.storageCapacity - this.storageTotalSize) / this.getResourceUnitSize(resourceType);
    }

    public canAddUnits(resourceType: ResourceType): number {
        return this.canAddAmount(resourceType) | 0;
    }

    public getResourceAmount(resourceType: ResourceType): number {
        const item = this.storageItems.find((it) => it.resourceType === resourceType);
        if (!item) {
            return 0;
        }
        return item.amount;
    }

    public canTakeAmount(resourceType: ResourceType, amount: number): boolean {
        return this.getResourceAmount(resourceType) >= amount;
    }

    public getResourceUnits(resourceType: ResourceType): number {
        return this.getResourceAmount(resourceType) | 0;
    }

    public addResource(resourceType: ResourceType, amount: number): void {
        if (amount > this.canAddAmount(resourceType)) {
            throw new Error(`Cannot add ${amount} of ${resourceType}`);
        }

        let item = this.storageItems.find((it) => it.resourceType === resourceType);
        if (!item) {
            item = { resourceType, amount: 0 };
        }
        item.amount += amount;
    }

    public takeResource(resourceType: ResourceType, amount: number): void {
        const id = this.storageItems.findIndex((item) => item.resourceType === resourceType);
        const item = this.storageItems[id];
        if (!item || amount > item.amount) {
            throw new Error(`Cannot take ${amount} of ${resourceType}`);
        }

        item.amount -= amount;
        if (item.amount === 0) {
            this.storageItems.splice(id, 1);
        }
    }

    protected abstract getResourceConfig(...args: Parameters<Rules['resourceConfig']>): ReturnType<Rules['resourceConfig']>;

    private getResourceUnitSize(resourceType: ResourceType): number {
        return this.getResourceConfig(resourceType).size;
    }
}
