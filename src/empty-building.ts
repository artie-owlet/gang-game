import type { GameContext } from './game-context';
import { ResourceStorage } from './resource-storage';
import { isEmptyBuildingData, type EmptyBuildingData, type BuildingId } from './schema/data/empty-building-data';
import { generateId } from './utils/random';
import { Wallet } from './wallet';

type CtorArgs = [EmptyBuildingData, GameContext] | [
    building: EmptyBuilding,
] | [
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [EmptyBuildingData, GameContext] {
    return isEmptyBuildingData(args[0]);
}

function isDemolitionCtorArgs(args: CtorArgs): args is [EmptyBuilding] {
    return args[0] instanceof EmptyBuilding;
}

export class EmptyBuilding {
    public readonly id: BuildingId;
    public readonly name: string;
    public readonly wallet: Wallet;
    public readonly storage: ResourceStorage;

    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data, game] = args;
            this.id = data.id;
            this.name = data.name;
            this.wallet = new Wallet(data.money);
            this.storage = new ResourceStorage(data.storage, game);
        } else if (isDemolitionCtorArgs(args)) {
            const [building] = args;
            this.id = building.id;
            this.name = building.name;
            this.wallet = building.wallet;
            this.storage = building.storage;
        } else {
            const [game] = args;
            this.id = generateId();
            this.name = game.randomizer.randomBuildingName();
            this.wallet = new Wallet(0);
            this.storage = new ResourceStorage(game.rules.generalConfig.buildingCapacity, game);
        }
    }
}
