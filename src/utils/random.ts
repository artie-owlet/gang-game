import { randomUUID } from 'crypto';

import type { FlavoredString } from './flavored-string';
import type { Odds } from './odds-schema';
import type { WeightedSet } from './weighted-set';

export interface Rng {
    random(maxExcl: number): number;
}

export function randomBool(odds: Odds, rng: Rng): boolean {
    return rng.random(odds[0] + odds[1]) < odds[0];
}

export function randomFromSet(set: WeightedSet, rng: Rng): number {
    const totalWeight = set.reduce((sum, item) => sum + item.weight, 0);
    const rv = rng.random(totalWeight);
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
    return randomUUID();
}
