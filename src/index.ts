/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { GameObjectFactory } from './utils/create-game-object-class';

interface Data {
    foo: string;
    bar: string;
    baz: string;
}

interface Foo {
    foo: string;
}

class Foo {
    public constructor(protected ctx: { getFoo: () => string }) {
    }

    public printFoo(): string {
        return this.foo + this.ctx.getFoo();
    }
}

interface Bar {
    bar: string;
}

class Bar {
    public constructor(protected ctx: { getBar: () => string }) {
    }

    public printBar(): string {
        return this.bar + this.ctx.getBar();
    }
}

// eslint-disable-next-line @stylistic/max-len
class Baz extends new GameObjectFactory(Foo, Bar).create<Data>() {
    public constructor(data: Data) {
        super(data, {
            getFoo: () => this.foo,
            getBar: () => this.bar,
        });
    }
}

const test = new Baz({
    foo: 'foo',
    bar: 'bar',
    baz: 'baz',
});

// eslint-disable-next-line no-console
console.log(test.printFoo(), test.printBar(), test.baz);
