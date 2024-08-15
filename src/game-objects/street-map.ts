import ss from 'superstruct';

import { Direction } from '../common-type-schemas/direction';
import { GameObjectClassFactory } from '../utils/game-object-class-factory';
import type { Rng } from '../utils/random';

// east (=1) and north (=2) borders of corner
const borderMaskSchema = ss.enums([0, 1, 2, 3]);

type BorderMask = ss.Infer<typeof borderMaskSchema>;

const streetSchema = ss.object({
    orientation: ss.enums(['horz', 'vert']),
    start: ss.number(),
    end: ss.number(),
});

type Street = ss.Infer<typeof streetSchema>;

export const streetMapDataSchema = ss.object({
    size: ss.number(),
    borderMasks: ss.array(borderMaskSchema),
    streets: ss.array(streetSchema),
});

type StreetMapData = ss.Infer<typeof streetMapDataSchema>;

interface Route {
    path: number[];
    lastDir?: Direction;
    straight: number;
}

export function last(arr: number[]): number {
    return arr[arr.length - 1] ?? -1;
}

function reduceRoutes(routes: Route[]): Route[] {
    const reduced: Route[] = [];
    const visited: number[] = [];
    routes.forEach((route) => {
        if (!visited.includes(last(route.path)) &&
            !routes.some((r) => last(r.path) === last(route.path) && r.straight < route.straight)) {
            reduced.push(route);
            visited.push(last(route.path));
        }
    });
    return reduced;
}

function isHorzBorder(mask: BorderMask): boolean {
    return Boolean(mask & 1);
}

function isVertBorder(mask: BorderMask): boolean {
    return Boolean(mask & 2);
}

export class StreetMap extends new GameObjectClassFactory().create<StreetMapData>() {
    public static create(size: number, rng: Rng): StreetMap {
        return new StreetMap(generateStreetMap(size, rng));
    }

    // TODO: Implement different move speed for unexplored and occupied corners
    public getRoute(from: number, to: number): Direction[] {
        let routes: Route[] = [{
            path: [],
            straight: 0,
        }];

        const visited: number[] = [from];
        const isVisited = (pos: number) => visited.includes(pos);

        while (routes.length > 0 && !routes.some(({ path }) => last(path) === to)) {
            const nextRoutes: Route[] = [];
            const addNextRoute = (dir: Direction, nextPosition: number, route: Route) => {
                if (!isVisited(nextPosition)) {
                    nextRoutes.push({
                        path: [...route.path, nextPosition],
                        lastDir: dir,
                        straight: route.straight + (route.lastDir === dir ? 1 : 0),
                    });
                }
            };

            routes.forEach((route) => {
                if (route.lastDir !== Direction.South && this.isWayNorth(last(route.path))) {
                    const nextPosition = this.getNextPosition(last(route.path), Direction.North);
                    addNextRoute(Direction.North, nextPosition, route);
                }

                if (route.lastDir !== Direction.West && this.isWayEast(last(route.path))) {
                    const nextPosition = this.getNextPosition(last(route.path), Direction.East);
                    addNextRoute(Direction.East, nextPosition, route);
                }

                if (route.lastDir !== Direction.North && this.isWaySouth(last(route.path))) {
                    const nextPosition = this.getNextPosition(last(route.path), Direction.South);
                    addNextRoute(Direction.South, nextPosition, route);
                }

                if (route.lastDir !== Direction.East && this.isWayWest(last(route.path))) {
                    const nextPosition = this.getNextPosition(last(route.path), Direction.West);
                    addNextRoute(Direction.West, nextPosition, route);
                }
            });

            routes = reduceRoutes(nextRoutes);
        }

        const route = routes[0];
        if (!route) {
            throw new Error(`Cannot route from ${from} to ${to}`);
        }
        return route.path;
    }

    public getNextPosition(from: number, dir: Direction): number {
        switch (dir) {
            case Direction.North:
                return from - this.size;
            case Direction.East:
                return from + 1;
            case Direction.South:
                return from + this.size;
            case Direction.West:
                return from - 1;
        }
    }

    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    private isWayNorth(from: number): boolean {
        return from - this.size >= 0 && !isVertBorder(this.borderMasks[from - this.size]!);
    }

    private isWayEast(from: number): boolean {
        return !isHorzBorder(this.borderMasks[from]!);
    }

    private isWaySouth(from: number): boolean {
        return !isVertBorder(this.borderMasks[from]!);
    }

    private isWayWest(from: number): boolean {
        return from > 0 && ((from - 1) / this.size | 0) === (from / this.size | 0) &&
            !isHorzBorder(this.borderMasks[from - 1]!);
    }
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
}

function remove(arr: number[], value: number): boolean {
    const id = arr.indexOf(value);
    if (id >= 0) {
        arr.splice(id, 1);
    }
    return id >= 0;
}

export function generateStreetMap(size: number, rng: Rng): StreetMapData {
    const sizeSquare = size ** 2;
    const positions = new Array(sizeSquare).fill(0).map((_, id) => id);
    const borderMasks: BorderMask[] = new Array<BorderMask>(sizeSquare).fill(3);
    const streets: Street[] = [];
    let horzLength = 0;
    let vertLength = 0;

    const createStreet = (pos: number, isHorz: boolean) => {
        const row = pos / size | 0;
        const orientation = isHorz ? 'horz' : 'vert';
        const orientMask = isHorz ? 2 : 1;
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
                    borderMasks[start] &= orientMask;
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
                    borderMasks[street.end] &= orientMask;
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
        const pos = positions.splice(rng.random(positions.length), 1)[0]!;
        createStreet(pos, vertLength > horzLength);
    }

    streets.forEach(({ orientation, start, end }) => {
        const isHorz = orientation === 'horz';
        if (isHorz ? (start / size | 0) === size - 1 : start % size === size - 1) {
            return;
        }

        const step = isHorz ? 1 : size;
        let length = 0;
        let maxLength = 1 + rng.random(4);
        for (let pos = start; pos <= end; pos += step) {
            ++length;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const mask = borderMasks[pos]!;
            if (isHorz ? !isVertBorder(mask) : !isHorzBorder(mask)) {
                length = 0;
            }
            if (length === maxLength) {
                borderMasks[pos] &= isHorz ? 1 : 2;
                length = 0;
                maxLength = 1 + rng.random(4);
            }
        }
    });

    return {
        size,
        borderMasks,
        streets,
    };
}
