/* eslint-disable @typescript-eslint/no-explicit-any */
type Ctor = abstract new(...args: any) => any;

type Intersection<T extends any[]> = T extends [infer A, infer B, ...infer Rest] ?
    Intersection<[A & B, ...Rest]> : (T extends [infer A] ? A : NonNullable<unknown>);

type InstanceTypeArray<C extends Ctor[]> = {
    [K in keyof C]: InstanceType<C[K]>
};

type GameObjectType<D, C extends Ctor[]> =
    abstract new(data: D) => D & Intersection<InstanceTypeArray<C>>;


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
