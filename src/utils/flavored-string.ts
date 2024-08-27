import ss from 'superstruct';

export type FlavoredString<T extends string> = string & { typename?: T };

export type FlavoredStringSchema<T extends string> = ss.Struct<FlavoredString<T>, null>;

export function defineFlavoredStringSchema<T extends string>(typename: T): FlavoredStringSchema<T> {
    return ss.define<FlavoredString<T>>(typename, (value) => ss.is(value, ss.string()));
}
