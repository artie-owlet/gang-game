import ss from 'superstruct';

import { Person, personSchema } from '../components/person';
import { createBaseClass } from '../utils/create-base-class';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { generateId } from '../utils/random';
import { safeMixin } from '../utils/safe-mixin';
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

export class Gangster extends safeMixin(
    createBaseClass<ss.Infer<typeof gangsterPrivateSchema>>(),
    Person,
) {
    public static create(randomizer: Randomizer): GangsterData {
        return {
            id: generateId(),
            ...Person.create(randomizer),
        };
    }
}
