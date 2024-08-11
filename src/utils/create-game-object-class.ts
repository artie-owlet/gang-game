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
        D & Intersection<InstanceTypeArray<C>> & { updateComponents(): void }
) : (
    abstract new(data: D) =>
        D & Intersection<InstanceTypeArray<C>> & { updateComponents(): void }
);

export const updateComponent = Symbol('updateComponent');

export class GameObjectFactory<C extends Ctor[]> {
    private Comps: Ctor[];

    public constructor(...Comps: C) {
        this.Comps = Comps;
    }

    public create<D>(): GameObjectType<D, C> {
        abstract class Base {
            public constructor(data: D, public ctx: unknown) {
                Object.assign(this, data);
            }

            public static updateableComponents: string[] = [];

            public updateComponents(): void {
                Base.updateableComponents.forEach((name) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    this[`update${name}`]();
                });
            }
        }

        this.Comps.forEach((Comp) => {
            const descs = Object.getOwnPropertyDescriptors(Comp.prototype);
            for (const key in descs) {
                const prop = descs[key];
                if (prop && key !== 'constructor') {
                    Object.defineProperty(Base.prototype, key, prop);
                }
            }

            const update = Object.getOwnPropertyDescriptor(Comp.prototype, updateComponent);
            if (update) {
                Base.updateableComponents.push(Comp.name);
                Object.defineProperty(Base.prototype, `update${Comp.name}`, update);
            }
        });

        return <GameObjectType<D, C>><unknown>Base;
    }
}
