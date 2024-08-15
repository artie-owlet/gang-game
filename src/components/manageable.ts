import ss from 'superstruct';

import { gangsterIdSchema, type Gangster } from '../game-objects/gangster';
import type { GangsterPerks } from '../rules/gangster-perks-config';
import type { WithContext } from './with-context';

export const manageableSchema = ss.object({
    managerId: ss.nullable(gangsterIdSchema),
});

type ManageableData = ss.Infer<typeof manageableSchema>;

export interface Manageable extends ManageableData, WithContext {
}

export abstract class Manageable {
    public static create(): ManageableData {
        return {
            managerId: null,
        };
    }

    public get manager(): Gangster | null {
        return this.managerId ? this.ctx.gangster(this.managerId) : null;
    }

    public getManagerPerkValue(perk: GangsterPerks): number {
        return this.manager?.getPerkValue(perk) ?? 0;
    }
}
