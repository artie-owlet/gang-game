import { BasePerson } from './base-person';
import type { GameContext } from './game-context';
import { isGangsterData, type GangsterData } from './schema/data/gangster-data';

type CtorArgs = [GangsterData] | [
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [GangsterData] {
    return isGangsterData(args);
}

export class Gangster extends BasePerson<'GangsterId'> {
    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data] = args;
            super(data);
        } else {
            const [game] = args;
            super(game);
        }
    }

    public override serialize(): GangsterData {
        return {
            ...super.serialize(),
        };
    }
}
