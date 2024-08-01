type DataCtor<T extends object> = new(data: T) => T;

export function createBaseClass<T extends object>(): DataCtor<T> {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    return <DataCtor<T>> class {
        protected constructor(data: T) {
            Object.assign(this, data);
        }
    };
}
