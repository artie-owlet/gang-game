import ss from 'superstruct';

import { Person, personSchema } from '../components/person';
import { GameObjectFactory } from '../utils/create-game-object-class';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { generateId } from '../utils/random';
import type { Randomizer } from './game-context';

export const gangsterIdSchema = defineFlavoredStringSchema('GangsterId');

export type GangsterId = ss.Infer<typeof gangsterIdSchema>;

const gangsterPrivateSchema = ss.object({
    id: gangsterIdSchema,
});

export const gangsterSchema = ss.intersection([
    gangsterPrivateSchema,
    personSchema,
]);

type GangsterData = ss.Infer<typeof gangsterSchema>;

export class Gangster extends new GameObjectFactory(Person).create<GangsterData>() {
    public static create(randomizer: Randomizer): GangsterData {
        return {
            id: generateId(),
            ...Person.create(randomizer),
        };
    }
}
