import ss from 'superstruct';

import type { GameContext } from '../game-objects/game-context';
import type { Gangster } from '../game-objects/gangster';

export const manageableSchema = ss.object({
    managerId: ss.nullable(ss.string()),
});

type ManageableData = ss.Infer<typeof manageableSchema>;

export interface Manageable extends ManageableData {
    ctx: Pick<GameContext, 'gangster'>;
}

export abstract class Manageable {
    public get manager(): Gangster | null {
        return this.managerId ? this.ctx.gangster(this.managerId) : null;
    }
}
