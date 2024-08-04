/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
type Ctor = abstract new(...args: any) => any;

type Intersection<T extends any[]> = T extends [infer A, infer B, ...infer Rest] ?
    Intersection<[A & B, ...Rest]> : (T extends [infer A] ? A : null);

type CtxArgArray<C extends Ctor[]> = {
    [K in keyof C]: ConstructorParameters<C[K]> extends [] ? NonNullable<unknown> : ConstructorParameters<C[K]>[0]
};

type InstanceTypeArray<C extends Ctor[]> = {
    [K in keyof C]: InstanceType<C[K]>
};

type ReturnType<D, C extends Ctor[]> =
    abstract new(data: D, ctx: Intersection<CtxArgArray<C>>) =>
        D & Intersection<InstanceTypeArray<C>>;

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
            console.log(Object.getPrototypeOf(Comp));
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
