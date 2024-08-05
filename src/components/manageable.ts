import ss from 'superstruct';

import type { GameContext } from '../game-objects/game-context';
import type { Gangster } from '../game-objects/gangster';

export const manageableSchema = ss.object({
    managerId: ss.nullable(ss.string()),
});

type ManageableData = ss.Infer<typeof manageableSchema>;

// export abstract class Manageable extends createBaseClass<ManageableData>() {
//     public constructor(
//         data: ManageableData,
//         private game: GameContext,
//     ) {
//         super(data);
//     }

//     public get manager(): Gangster | null {
//         return this.managerId ? this.game.gangster(this.managerId) : null;
//     }
// }

export function Manageable<
    Data extends object,
    Ctx extends object,
>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Base: new(data: Data, ctx: () => Ctx) => any,
) {
    interface Component extends ManageableData {}

    abstract class Component extends Base {
        public constructor(
            data: ManageableData & Data,
            protected ctx: () => Ctx & Pick<GameContext, 'gangster'>,
        ) {
            super(data, ctx);
        }

        public get manager(): Gangster | null {
            return this.managerId ? this.ctx().gangster(this.managerId) : null;
        }
    }

    return Component;
}
