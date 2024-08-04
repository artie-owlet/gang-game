import ss from 'superstruct';

import type { GameContext } from '../game-objects/game-context';
import type { Gangster } from '../game-objects/gangster';
import { createBaseClass } from '../utils/create-base-class';

export const manageableSchema = ss.object({
    managerId: ss.nullable(ss.string()),
});

type ManageableData = ss.Infer<typeof manageableSchema>;

export abstract class Manageable extends createBaseClass<ManageableData>() {
    public constructor(
        data: ManageableData,
        private game: GameContext,
    ) {
        super(data);
    }

    public get manager(): Gangster | null {
        return this.managerId ? this.game.gangster(this.managerId) : null;
    }
}
