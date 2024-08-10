import type { GameContext } from '../game-objects/game-context';

type Ctor = abstract new() => unknown;

type Intersection<T extends unknown[]> = T extends [infer A, infer B, ...infer Rest] ?
    Intersection<[A & B, ...Rest]> : (T extends [infer A] ? A : NonNullable<unknown>);

type InstanceTypeArray<C extends Ctor[]> = {
    [K in keyof C]: InstanceType<C[K]>
};

type HasContext<T extends unknown[]> = T extends [infer A, ...infer Rest] ? (
    A extends { ctx: GameContext } ? true : HasContext<Rest>
) : false;

type GameObjectType<D, C extends Ctor[]> = HasContext<InstanceTypeArray<C>> extends true ? (
    abstract new(data: D, ctx: GameContext) =>
        D & Intersection<InstanceTypeArray<C>>
) : (
    abstract new(data: D) =>
        D & Intersection<InstanceTypeArray<C>>
);

export class GameObjectFactory<C extends Ctor[]> {
    private Comps: Ctor[];

    public constructor(...Comps: C) {
        this.Comps = Comps;
    }

    public create<D>(): GameObjectType<D, C> {
        abstract class GameObject {
            public constructor(data: D, public ctx: unknown) {
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
