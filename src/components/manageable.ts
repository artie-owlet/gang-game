import ss from 'superstruct';

import type { Gangster } from '../game-objects/gangster';
import type { WithContext } from './with-context';

export const manageableSchema = ss.object({
    managerId: ss.nullable(ss.string()),
});

type ManageableData = ss.Infer<typeof manageableSchema>;

export interface Manageable extends ManageableData, WithContext {
}

export abstract class Manageable {
    public get manager(): Gangster | null {
        return this.managerId ? this.ctx.gangster(this.managerId) : null;
    }
}
