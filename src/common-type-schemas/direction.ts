import ss from 'superstruct';

export const enum Direction {
    North = 0,
    East = 1,
    South = 2,
    West = 3,
}

export const directionSchema = ss.enums([
    Direction.North,
    Direction.East,
    Direction.South,
    Direction.West,
]);
