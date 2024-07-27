import { BaseBuilding } from './base-building';
import type { GameContext } from './game-context';
import { ResourceStorage } from './resource-storage';
import { isBaseStorageBuildingData, type BaseStorageBuildingData } from './schema/data/base-storage-building-data';
import { Wallet } from './wallet';

type CtorArgs<T extends string> = [BaseStorageBuildingData<T>, GameContext] | [
    building: BaseStorageBuilding<string>,
] | [
    game: GameContext,
];

function isLoadCtorArgs<T extends string>(args: CtorArgs<T>): args is [BaseStorageBuildingData<T>, GameContext] {
    return isBaseStorageBuildingData(args[0]);
}

function isRebuildCtorArgs<T extends string>(args: CtorArgs<T>): args is [BaseStorageBuilding<string>] {
    return args[0] instanceof BaseStorageBuilding;
}

export abstract class BaseStorageBuilding<T extends string> extends BaseBuilding<T> {
    public readonly wallet: Wallet;
    public readonly storage: ResourceStorage;

    public constructor(...args: CtorArgs<T>) {
        if (isLoadCtorArgs(args)) {
            const [data, game] = args;
            super(data);
            this.wallet = new Wallet(data.money);
            this.storage = new ResourceStorage(data.storage, game);
        } else if (isRebuildCtorArgs(args)) {
            const [building] = args;
            super(building);
            this.wallet = building.wallet;
            this.storage = building.storage;
        } else {
            const [game] = args;
            super(game);
            this.wallet = new Wallet(0);
            this.storage = new ResourceStorage(game.rules.generalConfig.buildingCapacity, game);
        }
    }

    public override serialize(): BaseStorageBuildingData<T> {
        return {
            ...super.serialize(),
            money: this.wallet.money,
            storage: this.storage.serialize(),
        };
    }
}
