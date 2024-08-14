import assert from 'assert';

export function recordValue<K extends string, V>(record: Record<K, V>, key: K): V {
    const value = record[key];
    assert(value !== undefined, `No value for key ${key}`);
    return value;
}

export function recordEntries<K extends string, V>(record: Record<K, V>): [K, V][] {
    return <[K, V][]>Object.entries(record);
}
