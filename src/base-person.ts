import type { GameContext } from './game-context';
import { isBasePersonData, type BasePersonData } from './schema/data/base-person-data';
import type { FlavoredString } from './utils/flavored-string';
import { generateId } from './utils/random';

type CtorArgs<T extends string> = [BasePersonData<T>] | [
    game: GameContext,
];

function isLoadCtorArgs<T extends string>(args: CtorArgs<T>): args is [BasePersonData<T>] {
    return isBasePersonData(args[0]);
}

export abstract class BasePerson<T extends string> {
    public readonly id: FlavoredString<T>;
    public readonly name: string;

    public constructor(...args: CtorArgs<T>) {
        if (isLoadCtorArgs(args)) {
            const [data] = args;
            this.id = data.id;
            this.name = data.name;
        } else {
            const [game] = args;
            this.id = generateId();
            this.name = game.randomizer.randomPersonName();
        }
    }

    public serialize(): BasePersonData<T> {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
