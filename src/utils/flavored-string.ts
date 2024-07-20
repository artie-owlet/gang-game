import ss from 'superstruct';

export type FlavoredString<T extends string> = string & { typename?: T };

export function defineFlavoredStringSchema<T extends string>(name: T): ss.Struct<FlavoredString<T>, null> {
    return ss.define<FlavoredString<T>>(name, (value) => ss.is(value, ss.string()));
}
