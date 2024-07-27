import { BaseStorageBuilding } from './base-storage-building';
import type { GameContext } from './game-context';
import { isEmptyBuildingData, type EmptyBuildingData } from './schema/data/empty-building-data';

type CtorArgs = [EmptyBuildingData, GameContext] | [
    building: BaseStorageBuilding<string>,
] | [
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [EmptyBuildingData, GameContext] {
    return isEmptyBuildingData(args[0]);
}

function isDemolitionCtorArgs(args: CtorArgs): args is [BaseStorageBuilding<string>] {
    return args[0] instanceof BaseStorageBuilding;
}

export class EmptyBuilding extends BaseStorageBuilding<'EmptyBuildingId'> {
    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data, game] = args;
            super(data, game);
        } else if (isDemolitionCtorArgs(args)) {
            const [building] = args;
            super(building);
        } else {
            const [game] = args;
            super(game);
        }
    }
}
