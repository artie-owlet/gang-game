/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import ss from 'superstruct';

import type { Randomizer } from '../game-objects/game-context';
import { createBaseClass } from '../utils/create-base-class';
import { defineFlavoredStringSchema } from '../utils/flavored-string';
import { randomBool } from '../utils/random';

export const photoIdSchema = defineFlavoredStringSchema('PhotoId');

export type PhotoId = ss.Infer<typeof photoIdSchema>;

export const genderSchema = ss.enums(['female', 'male']);

export type GenderType = ss.Infer<typeof genderSchema>;

export const personSchema = ss.object({
    gender: genderSchema,
    personName: ss.string(),
    photoId: photoIdSchema,
});

type PersonData = ss.Infer<typeof personSchema>;

export function createPerson(base: new(data: any) => any) {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Person extends PersonData {}

    abstract class Person extends base {
    }
    return Person;
}

// export interface Context {
//     randomizer: Randomizer;
// }

// export abstract class Person extends createBaseClass<PersonData>() {
//     public static create(randomizer: Randomizer): PersonData {
//         const gender = randomBool([1, 1], randomizer.rng) ? 'female' : 'male';
//         return {
//             gender,
//             personName: randomizer.personName(gender),
//             photoId: randomizer.photo(gender),
//         };
//     }
// }
