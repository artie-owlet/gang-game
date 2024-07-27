import type { GameContext } from './game-context';
import { isBaseBuildingData, type BaseBuildingData } from './schema/data/base-building-data';
import type { FlavoredString } from './utils/flavored-string';
import { generateId } from './utils/random';

type CtorArgs<T extends string> = [BaseBuildingData<T>] | [
    building: BaseBuilding<string>,
] | [
    game: GameContext,
];

function isLoadCtorArgs<T extends string>(args: CtorArgs<T>): args is [BaseBuildingData<T>] {
    return isBaseBuildingData(args[0]);
}

function isRebuildCtorArgs<T extends string>(args: CtorArgs<T>): args is [BaseBuilding<string>] {
    return args[0] instanceof BaseBuilding;
}

export abstract class BaseBuilding<T extends string> {
    public readonly id: FlavoredString<T>;
    public readonly name: string;

    public constructor(...args: CtorArgs<T>) {
        if (isLoadCtorArgs(args)) {
            const [data] = args;
            this.id = data.id;
            this.name = data.name;
        } else if (isRebuildCtorArgs(args)) {
            const [building] = args;
            this.id = <string>building.id;
            this.name = building.name;
        } else {
            const [game] = args;
            this.id = generateId();
            this.name = game.randomizer.randomBuildingName();
        }
    }

    public serialize(): BaseBuildingData<T> {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
