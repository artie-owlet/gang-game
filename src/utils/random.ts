import { randomUUID } from 'crypto';

import type { WeightedSet } from '../schema/utils/weighted-set';
import type { FlavoredString } from './flavored-string';

export interface Rng {
    random(maxExcl: number): number;
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
    return randomUUID() as FlavoredString<T>;
}
