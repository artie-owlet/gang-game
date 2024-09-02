// FIXME: Possibly unused
export function createCompMemberClass<D>(): new(data: D) => D {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    return <new(data: D) => D>(class {
        public constructor(data: D) {
            Object.assign(this, data);
        }
    });
}
