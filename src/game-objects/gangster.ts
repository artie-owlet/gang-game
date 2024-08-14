import ss from 'superstruct';

import { Person, personSchema } from '../components/person';
import { WithContext } from '../components/with-context';
import { gangsterPerksSchema, type GangsterPerks } from '../rules/gangster-perks-config';
import { GameObjectFactory } from '../utils/create-game-object-class';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { JsonMap } from '../utils/json-tools';
import { generateId } from '../utils/random';
import type { Randomizer } from './game-context';

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

type GangsterData = ss.Infer<typeof gangsterSchema>;

export class Gangster extends new GameObjectFactory(Person, WithContext).create<GangsterData>() {
    public static create(randomizer: Randomizer): GangsterData {
        return {
            id: generateId(),
            perks: new JsonMap<GangsterPerks, number>(),
            ...Person.create(randomizer),
        };
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
