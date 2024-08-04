type DataCtor<T extends object> = abstract new(data: T) => T;

export function createBaseClass<T extends object>(): DataCtor<T> {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    abstract class Data {
        public constructor(data: T) {
            Object.assign(this, data);
        }
    }
    return <DataCtor<T>>Data;
}
