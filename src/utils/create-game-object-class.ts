/* eslint-disable @typescript-eslint/no-explicit-any */
type Ctor = abstract new(...args: any) => any;

type Intersection<T extends any[]> = T extends [infer A, infer B, ...infer Rest] ?
    Intersection<[A & B, ...Rest]> : (T extends [infer A] ? A : NonNullable<unknown>);

type CtxArray<C extends Ctor[]> = C extends [] ? [NonNullable<unknown>] : {
    [K in keyof C]: InstanceType<C[K]> extends { ctx: infer Ctx } ? Ctx : NonNullable<unknown>
};

type InstanceTypeArray<C extends Ctor[]> = {
    [K in keyof C]: InstanceType<C[K]>
};

type IsEmpty<T> = T extends Record<string, never> ? true : false;

type GameObjectType<D, C extends Ctor[]> = IsEmpty<Intersection<CtxArray<C>>> extends true ? (
    abstract new(data: D) =>
        D & Intersection<InstanceTypeArray<C>>
) : (
    abstract new(data: D, ctx: Intersection<CtxArray<C>>) =>
        D & Intersection<InstanceTypeArray<C>> & { ctx: Intersection<CtxArray<C>> }
);

export class GameObjectFactory<C extends Ctor[]> {
    private Comps: Ctor[];

    public constructor(...Comps: C) {
        this.Comps = Comps;
    }

    public create<D>(): GameObjectType<D, C> {
        abstract class GameObject {
            public constructor(data: D, protected ctx: any) {
                Object.assign(this, data);
            }
        }
        this.Comps.forEach((Comp) => {
            const descs = Object.getOwnPropertyDescriptors(Comp.prototype);
            for (const key in descs) {
                const prop = descs[key];
                if (prop && key !== 'constructor') {
                    Object.defineProperty(GameObject.prototype, key, prop);
                }
            }
        });
        return <GameObjectType<D, C>>GameObject;
    }
}

type InstanceCtxArray<C extends any[]> = C extends [] ? [NonNullable<unknown>] : {
    [K in keyof C]: C[K] extends { ctx: infer Ctx } ? Ctx : NonNullable<unknown>
};

export type ExtendCtx<Ctx, C extends any[]> = Ctx & Intersection<InstanceCtxArray<C>>;
