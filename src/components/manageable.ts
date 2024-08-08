import ss from 'superstruct';

import type { GameContext } from '../game-objects/game-context';
import type { Gangster } from '../game-objects/gangster';

export const manageableSchema = ss.object({
    managerId: ss.nullable(ss.string()),
});

type ManageableData = ss.Infer<typeof manageableSchema>;

export interface Manageable extends ManageableData {
}

export abstract class Manageable {
    public get manager(): Gangster | null {
        return this.managerId ? this.getGangster(this.managerId) : null;
    }

    protected abstract getGangster(...args: Parameters<GameContext['gangster']>): ReturnType<GameContext['gangster']>;
}
