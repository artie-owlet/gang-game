import { isPersonData, type PersonData, type PersonId } from './data/person-data';
import type { GameContext } from './game-context';
import { generateId } from './utils/random';

type CtorArgs = [PersonData] | [
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [PersonData] {
    return isPersonData(args);
}

export class Person {
    public readonly id: PersonId;
    public readonly name: string;

    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data] = args;
            this.id = data.id;
            this.name = data.name;
        } else {
            const [game] = args;
            this.id = generateId();
            this.name = game.randomPersonName();
        }
    }

    public serialize(): PersonData {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
