/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { createGameObjectClass } from './utils/create-game-object-class';

interface Data {
    foo: string;
    bar: string;
    baz: string;
}

interface Foo {
    foo: string;
}

abstract class Foo {
    public constructor(protected ctx: { getFoo: () => string }) {
    }

    public printFoo(): string {
        return this.foo + this.ctx.getFoo();
    }
}

interface Bar {
    bar: string;
}

abstract class Bar {
    public constructor(protected ctx: { getBar: () => string }) {
    }

    public printBar(): string {
        return this.bar + this.ctx.getBar();
    }
}

// eslint-disable-next-line @stylistic/max-len
class Baz extends createGameObjectClass<Data, [Foo, Bar], [{ getFoo: () => string }, { getBar: () => string }]>(Foo, Bar) {
    public constructor(data: Data, protected ctx: )
}
