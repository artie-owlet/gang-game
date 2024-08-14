export class JsonMap<K extends string, V> extends Map<K, V> {
    public toJson() {
        const json: Record<string, V | string> = { __type: 'Map' };
        for (const [key, value] of this.entries()) {
            json[key] = value;
        }
        return json;
    }
}

function reviver(_: string, value: unknown) {
    if (typeof value === 'object' && value !== null && '__type' in value && value.__type === 'Map') {
        return new Map(Object.entries(value).filter(([key]) => key !== '__type'));
    }
    return value;
}

export function jsonParse(json: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(json, reviver);
}
