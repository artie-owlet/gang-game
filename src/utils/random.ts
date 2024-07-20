import { randomUUID } from 'crypto';

import type { WeightedSet } from '../data/weighted-set';
import type { FlavoredString } from './flavored-string';

export interface Randomizer {
    random(maxExcl: number): number;
}

export function randomFromSet(set: WeightedSet, rand: Randomizer): number {
    const totalWeight = set.reduce((sum, item) => sum + item.weight, 0);
    const rv = rand.random(totalWeight);
    let upper = 0;
    for (const { value, weight } of set) {
        upper += weight;
        if (rv < upper) {
            return value;
        }
    }
    throw new Error('randomFromSet() failed');
}
export function generateId<T extends string>(): FlavoredString<T> {
    return randomUUID() as FlavoredString<T>;
}
