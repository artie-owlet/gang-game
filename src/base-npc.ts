import type { GameContext } from './game-context';
import { isBaseNpcData, type BaseNpcData } from './schema/data/base-npc-data';
import type { FlavoredString } from './utils/flavored-string';
import { generateId } from './utils/random';

type CtorArgs<T extends string> = [BaseNpcData<T>] | [
    game: GameContext,
];

function isLoadCtorArgs<T extends string>(args: CtorArgs<T>): args is [BaseNpcData<T>] {
    return isBaseNpcData(args[0]);
}

export abstract class BaseNpc<T extends string> {
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

    public serialize(): BaseNpcData<T> {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
