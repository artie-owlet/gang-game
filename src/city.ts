import { Corner } from './corner';
import { generateStreetMap, type CornerBorders } from './generators/generate-street-map';
import { isCityData, type CityData } from './schema/data/city-data';
import { Direction } from './schema/utils/direction';
import type { Randomizer } from './utils/random';

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

type CtorArgs = [CityData] | [
    size: number,
    corners: Corner[],
    rand: Randomizer,
];

function isLoadCtorArgs(args: CtorArgs): args is [CityData] {
    return isCityData(args[0]);
}

export class City {
    public readonly size: number;

    private corners_: Corner[];
    private borders_: CornerBorders[];

    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data] = args;
            this.size = data.size;
            this.corners_ = data.corners.map((corner) => new Corner(corner));
            this.borders_ = data.borders.map((b) => ({
                horz: !!(b & 1),
                vert: !!(b & 2),
            }));
        } else {
            const [size, corners, rand] = args;
            if (corners.length !== size ** 2) {
                throw new Error('Invalid corners array length');
            }

            this.size = size;
            this.corners_ = corners;

            const streetMap = generateStreetMap(size, rand);
            this.borders_ = streetMap.borders;
        }
    }

    public serialize(): CityData {
        return {
            size: this.size,
            corners: this.corners_.map((corner) => corner.serialize()),
            borders: this.borders_.map(({ horz, vert }) => Number(vert) * 2 + Number(horz)),
        };
    }

    public corner(pos: number): Corner {
        const corner = this.corners_[pos];
        if (!corner) {
            throw new Error(`No corner at ${pos}`);
        }
        return corner;
    }

    public get corners(): readonly Corner[] {
        return this.corners_;
    }

    public get borders(): readonly CornerBorders[] {
        return this.borders_;
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
        return from - this.size >= 0 && !this.borders_[from - this.size]!.vert;
    }

    private isWayEast(from: number): boolean {
        return !this.borders_[from]!.horz;
    }

    private isWaySouth(from: number): boolean {
        return !this.borders_[from]!.vert;
    }

    private isWayWest(from: number): boolean {
        return from > 0 && ((from - 1) / this.size | 0) === (from / this.size | 0) && !this.borders_[from - 1]!.horz;
    }
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
}
