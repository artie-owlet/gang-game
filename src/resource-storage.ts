import type { GameContext } from './game-context';
import {
    isResourceStorageData,
    type ResourceStorageData,
    type ResourceStorageItem,
} from './schema/data/resource-storage-data';
import type { ResourceType } from './schema/rules/resource-config';

type CtorArgs = [ResourceStorageData, GameContext] | [
    capacity: number,
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [ResourceStorageData, GameContext] {
    return isResourceStorageData(args[0]);
}

export class ResourceStorage {
    public readonly capacity: number;

    private items_: ResourceStorageItem[];
    private game: GameContext;

    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data, game] = args;
            this.capacity = data.capacity;
            this.items_ = data.items;
            this.game = game;
        } else {
            const [capacity, game] = args;
            this.capacity = capacity;
            this.items_ = [];
            this.game = game;
        }
    }

    public serialize(): ResourceStorageData {
        return {
            capacity: this.capacity,
            items: this.items_,
        };
    }

    public get items(): readonly Readonly<ResourceStorageItem>[] {
        return this.items_;
    }

    public get totalSize(): number {
        return this.items_.reduce((acc, item) => {
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
        const item = this.items_.find((it) => it.resourceType === resourceType);
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

        let item = this.items_.find((it) => it.resourceType === resourceType);
        if (!item) {
            item = { resourceType, amount: 0 };
        }
        item.amount += amount;
    }

    public takeResource(resourceType: ResourceType, amount: number): void {
        const id = this.items_.findIndex((item) => item.resourceType === resourceType);
        const item = this.items_[id];
        if (!item || amount > item.amount) {
            throw new Error(`Cannot take ${amount} of ${resourceType}`);
        }

        item.amount -= amount;
        if (item.amount === 0) {
            this.items_.splice(id, 1);
        }
    }

    private getResourceUnitSize(resourceType: ResourceType): number {
        return this.game.resourceConfig(resourceType).size;
    }
}
