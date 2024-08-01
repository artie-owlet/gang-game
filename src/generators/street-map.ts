import ss from 'superstruct';

import { createBaseClass } from '../utils/create-base-class';
import type { Rng } from '../utils/random';

// east (=1) and north (=2) borders of corner
const borderSchema = ss.enums([0, 1, 2, 3]);

type Border = ss.Infer<typeof borderSchema>;

const streetSchema = ss.object({
    orientation: ss.enums(['horz', 'vert']),
    start: ss.number(),
    end: ss.number(),
});

type Street = ss.Infer<typeof streetSchema>;

export const streetMapDataSchema = ss.object({
    size: ss.number(),
    borders: ss.array(borderSchema),
    streets: ss.array(streetSchema),
});

type StreetMapData = ss.Infer<typeof streetMapDataSchema>;

export class StreetMap extends createBaseClass<StreetMapData>() {
}

function remove(arr: number[], value: number): boolean {
    const id = arr.indexOf(value);
    if (id >= 0) {
        arr.splice(id, 1);
    }
    return id >= 0;
}

export function generateStreetMap(size: number, rand: Rng): StreetMap {
    const sizeSquare = size ** 2;
    const positions = new Array(sizeSquare).fill(0).map((_, id) => id);
    const borders: Border[] = new Array<Border>(sizeSquare).fill(3);
    const streets: Street[] = [];
    let horzLength = 0;
    let vertLength = 0;

    const createStreet = (pos: number, isHorz: boolean) => {
        const row = pos / size | 0;
        const orientation = isHorz ? 'horz' : 'vert';
        const ornMask = isHorz ? 2 : 1;
        const step = isHorz ? 1 : size;

        const street: Street = {
            orientation,
            start: pos,
            end: pos,
        };
        streets.push(street);

        let bw = true;
        let fw = true;
        while (bw || fw) {
            if (bw) {
                const start = street.start - step;
                if (start < 0 || isHorz && (start / size | 0) < row) {
                    bw = false;
                } else {
                    borders[start] &= ornMask;
                    street.start = start;
                    isHorz ? ++horzLength : ++vertLength;
                    if (!remove(positions, start)) {
                        break;
                    }
                }
            }

            if (fw) {
                const end = street.end + step;
                if (end >= sizeSquare || isHorz && (end / size | 0) > row) {
                    fw = false;
                } else {
                    borders[street.end] &= ornMask;
                    street.end = end;
                    isHorz ? ++horzLength : ++vertLength;
                    if (!remove(positions, end)) {
                        break;
                    }
                }
            }
        }
    };

    while (positions.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const pos = positions.splice(rand.random(positions.length), 1)[0]!;
        createStreet(pos, vertLength > horzLength);
    }

    streets.forEach(({ orientation, start, end }) => {
        const isHorz = orientation === 'horz';
        if (isHorz ? (start / size | 0) === size - 1 : start % size === size - 1) {
            return;
        }

        const step = isHorz ? 1 : size;
        let length = 0;
        let maxLength = 1 + rand.random(4);
        for (let pos = start; pos <= end; pos += step) {
            ++length;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const corner = borders[pos]!;
            if (isHorz ? !corner.vert : !corner.horz) {
                length = 0;
            }
            if (length === maxLength) {
                if (isHorz) {
                    corner.vert = false;
                } else {
                    corner.horz = false;
                }
                length = 0;
                maxLength = 1 + rand.random(4);
            }
        }
    });

    return {
        size,
        borders,
        streets,
    };
}
