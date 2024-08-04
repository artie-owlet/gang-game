type DataCtor<T extends object> = abstract new(data: T) => T;

type ComponentCtor<C extends object, Ctx extends object> = abstract new(ctx?: Ctx) => C;

type ComponentCtorArray<C extends object[], Ctx extends object[]> = {
    [K in keyof C]: K extends keyof Ctx ? ComponentCtor<C[K], Ctx[K]> : never
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Intersection<T extends any[]> = T extends [infer A, infer B, ...infer Rest] ?
    Intersection<[A & B, ...Rest]> : T[0];

export function createGameObjectClass<D extends object, C extends object[], Ctx extends object[]>(
    ...Comps: ComponentCtorArray<C, Ctx>
): abstract new(data: D, ctx: Intersection<Ctx>) => Intersection<[DataCtor<D>, ...C]> {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    abstract class GameObject {
        public constructor(data: D, protected ctx: Intersection<Ctx>) {
            Object.assign(this, data);
        }
    }
}
