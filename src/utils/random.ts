import { randomUUID } from 'crypto';

import type { Odds } from '../common-type-schemas/odds-schema';
import type { WeightedSet } from '../common-type-schemas/weighted-set';
import type { FlavoredString } from './flavored-string';

export interface Rng {
    random(maxExcl: number): number;
}

export function randomBool(odds: Odds, rng: Rng): boolean {
    return rng.random(odds[0] + odds[1]) < odds[0];
}

export function randomFromSet<T>(set: WeightedSet<T>, rng: Rng): T {
    const totalWeight = set.reduce((sum, [, weight]) => sum + weight, 0);
    const rv = rng.random(totalWeight);
    let upper = 0;
    for (const [value, weight] of set) {
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
