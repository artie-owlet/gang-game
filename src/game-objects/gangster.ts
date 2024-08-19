import ss from 'superstruct';

import { Person, personSchema } from '../components/person';
import { WithContext } from '../components/with-context';
import { type GangsterPerks, gangsterPerksSchema } from '../rules/gangster-perks-config';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { GameObjectClassFactory } from '../utils/game-object-class-factory';
import { JsonMap } from '../utils/json-tools';
import { generateId } from '../utils/random';
import type { GameContext } from './game-context';

export const gangsterIdSchema = defineFlavoredStringSchema('GangsterId');

export type GangsterId = ss.Infer<typeof gangsterIdSchema>;

const gangsterPrivateSchema = ss.object({
    id: gangsterIdSchema,
    perks: ss.map(gangsterPerksSchema, ss.number()),
});

export const gangsterSchema = ss.intersection([
    gangsterPrivateSchema,
    personSchema,
]);

export class Gangster extends new GameObjectClassFactory(
    Person,
    WithContext,
).create<ss.Infer<typeof gangsterSchema>>() {
    public static create(ctx: GameContext): Gangster {
        const gangster = new Gangster({
            id: generateId(),
            perks: new JsonMap<GangsterPerks, number>(),
            ...Person.create(ctx.randomizer),
        }, ctx);
        ctx.addGangster(gangster);
        return gangster;
    }

    public getPerkValue(perk: GangsterPerks): number {
        const perkLevel = this.perks.get(perk);
        if (perkLevel === undefined) {
            return 0;
        }
        if (perkLevel >= this.ctx.rules.gangsterPerksConfig[perk].length) {
            throw new Error(`Invalid perk level for ${perk}`);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.ctx.rules.gangsterPerksConfig[perk][perkLevel]!;
    }
}
