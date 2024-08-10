import ss from 'superstruct';

export type FlavoredString<T extends string> = string & { typename?: T };

export function defineFlavoredStringSchema<T extends string>(typename: T): ss.Struct<FlavoredString<T>, null> {
    return ss.define<FlavoredString<T>>(typename, (value) => ss.is(value, ss.string()));
}
