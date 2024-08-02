import ss from 'superstruct';

import type { GameContext } from '../game-objects/game-context';
import { resourceTypeSchema, type ResourceType } from '../rules/resource-config';
import { createBaseClass } from '../utils/create-base-class';

export const resourceStorageItemSchema = ss.object({
    resourceType: resourceTypeSchema,
    amount: ss.number(),
});

export type ResourceStorageItem = ss.Infer<typeof resourceStorageItemSchema>;

const resourceStorageSchema = ss.object({
    capacity: ss.number(),
    items: ss.array(resourceStorageItemSchema),
});

type ResourceStorageData = ss.Infer<typeof resourceStorageSchema>;

class ResourceStorage extends createBaseClass<ResourceStorageData>() {
    public constructor(
        data: ResourceStorageData,
        private game: () => GameContext,
    ) {
        super(data);
    }

    public get totalSize(): number {
        return this.items.reduce((acc, item) => {
            return acc + item.amount * this.getResourceUnitSize(item.resourceType);
        }, 0);
    }

    public canAddAmount(resourceType: ResourceType): number {
        return (this.capacity - this.totalSize) / this.getResourceUnitSize(resourceType);
    }

    public canAddUnits(resourceType: ResourceType): number {
        return this.canAddAmount(resourceType) | 0;
    }

    public getResourceAmount(resourceType: ResourceType): number {
        const item = this.items.find((it) => it.resourceType === resourceType);
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

        let item = this.items.find((it) => it.resourceType === resourceType);
        if (!item) {
            item = { resourceType, amount: 0 };
        }
        item.amount += amount;
    }

    public takeResource(resourceType: ResourceType, amount: number): void {
        const id = this.items.findIndex((item) => item.resourceType === resourceType);
        const item = this.items[id];
        if (!item || amount > item.amount) {
            throw new Error(`Cannot take ${amount} of ${resourceType}`);
        }

        item.amount -= amount;
        if (item.amount === 0) {
            this.items.splice(id, 1);
        }
    }

    private getResourceUnitSize(resourceType: ResourceType): number {
        return this.game().rules.resourceConfig(resourceType).size;
    }
}

export const ResourceStorageComponentSchema = ss.object({
    storage: resourceStorageSchema,
});

type ResourceStorageComponentData = ss.Infer<typeof ResourceStorageComponentSchema>;

export class ResourceStorageComponent {
    public storage: ResourceStorage;

    public constructor({ storage }: ResourceStorageComponentData, game: GameContext) {
        this.storage = new ResourceStorage(storage, () => game);
    }
}
