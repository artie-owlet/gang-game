/* eslint-disable @typescript-eslint/no-explicit-any */
type Ctor = abstract new(...args: any) => any;

type Intersection<T extends any[]> = T extends [infer A, infer B, ...infer Rest] ?
    Intersection<[A & B, ...Rest]> : (T extends [infer A] ? A : null);

type CtxArray<C extends Ctor[]> = {
    [K in keyof C]: InstanceType<C[K]> extends { ctx: infer Ctx } ? Ctx : NonNullable<unknown>
};

type InstanceTypeArray<C extends Ctor[]> = {
    [K in keyof C]: InstanceType<C[K]>
};

type ReturnType<D, C extends Ctor[]> =
    abstract new(data: D, ctx: Intersection<CtxArray<C>>) =>
        D & Intersection<InstanceTypeArray<C>> & { ctx: Intersection<CtxArray<C>> };

export class GameObjectFactory<C extends Ctor[]> {
    private Comps: Ctor[];

    public constructor(...Comps: C) {
        this.Comps = Comps;
    }

    public create<D>(): ReturnType<D, C> {
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
        return <ReturnType<D, C>>GameObject;
    }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class EmptyComponent {
}
