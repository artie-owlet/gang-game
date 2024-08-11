import ss, { type Struct } from 'superstruct';

export function ssPartialRecord<K extends string, V>(
    key: Struct<K>,
    value: Struct<V>,
): Struct<Partial<Record<K, V>>, null> {
    return <Struct<Partial<Record<K, V>>, null>>ss.record(key, value);
}
