import { isCornerData, type CornerData } from './data/corner-data';
import type { GameContext } from './game-context';

type CtorArgs = [CornerData] | [
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [CornerData] {
    return isCornerData(args[0]);
}

export class Corner {
    public readonly name: string;

    private explored_ = false;

    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data] = args;
            this.name = data.name;
            this.explored_ = data.explored;
        } else {
            const [game] = args;
            this.name = game.randomCornerName();
            this.explored_ = false;
        }
    }

    public serialize(): CornerData {
        return {
            name: this.name,
            explored: this.explored_,
        };
    }

    public get explored(): boolean {
        return this.explored_;
    }

    public explore(): void {
        this.explored_ = true;
    }
}
