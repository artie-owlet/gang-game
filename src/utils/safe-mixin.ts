/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mixin } from 'ts-mixer';

type IsSafeIntersection<S extends unknown[]> = S extends [infer T1, infer T2, ...infer Rest] ?
    (((keyof T1) & (keyof T2)) extends never ? IsSafeIntersection<[T1 & T2, ...Rest]> : false) :
    true;

type Ctor<T> = abstract new(...args: any[]) => T;

type MixinRet2<T1, T2> = IsSafeIntersection<[T1, T2]> extends true ?
    ReturnType<typeof Mixin<
        any[], T1, Ctor<T1>,
        any[], T2, Ctor<T2>
    >> : never;

type MixinRet3<T1, T2, T3> = IsSafeIntersection<[T1, T2, T3]> extends true ?
    ReturnType<typeof Mixin<
        any[], T1, Ctor<T1>,
        any[], T2, Ctor<T2>,
        any[], T3, Ctor<T3>
    >> : never;

type MixinRet4<T1, T2, T3, T4> = IsSafeIntersection<[T1, T2, T3, T4]> extends true ?
    ReturnType<typeof Mixin<
        any[], T1, Ctor<T1>,
        any[], T2, Ctor<T2>,
        any[], T3, Ctor<T3>,
        any[], T4, Ctor<T4>
    >> : never;

type MixinRet5<T1, T2, T3, T4, T5> = IsSafeIntersection<[T1, T2, T3, T4, T5]> extends true ?
    ReturnType<typeof Mixin<
        any[], T1, Ctor<T1>,
        any[], T2, Ctor<T2>,
        any[], T3, Ctor<T3>,
        any[], T4, Ctor<T4>,
        any[], T5, Ctor<T5>
    >> : never;

type MixinRet6<T1, T2, T3, T4, T5, T6> = IsSafeIntersection<[T1, T2, T3, T4, T5, T6]> extends true ?
    ReturnType<typeof Mixin<
        any[], T1, Ctor<T1>,
        any[], T2, Ctor<T2>,
        any[], T3, Ctor<T3>,
        any[], T4, Ctor<T4>,
        any[], T5, Ctor<T5>,
        any[], T6, Ctor<T6>
    >> : never;

type MixinRet7<T1, T2, T3, T4, T5, T6, T7> = IsSafeIntersection<[T1, T2, T3, T4, T5, T6, T7]> extends true ?
    ReturnType<typeof Mixin<
        any[], T1, Ctor<T1>,
        any[], T2, Ctor<T2>,
        any[], T3, Ctor<T3>,
        any[], T4, Ctor<T4>,
        any[], T5, Ctor<T5>,
        any[], T6, Ctor<T6>,
        any[], T7, Ctor<T7>
    >> : never;

type MixinRet8<T1, T2, T3, T4, T5, T6, T7, T8> = IsSafeIntersection<[T1, T2, T3, T4, T5, T6, T7, T8]> extends true ?
    ReturnType<typeof Mixin<
        any[], T1, Ctor<T1>,
        any[], T2, Ctor<T2>,
        any[], T3, Ctor<T3>,
        any[], T4, Ctor<T4>,
        any[], T5, Ctor<T5>,
        any[], T6, Ctor<T6>,
        any[], T7, Ctor<T7>,
        any[], T8, Ctor<T8>
    >> : never;

type MixinRet9<T1, T2, T3, T4, T5, T6, T7, T8, T9> = IsSafeIntersection<[T1, T2, T3, T4, T5, T6, T7, T8, T9]> extends true ?
    ReturnType<typeof Mixin<
        any[], T1, Ctor<T1>,
        any[], T2, Ctor<T2>,
        any[], T3, Ctor<T3>,
        any[], T4, Ctor<T4>,
        any[], T5, Ctor<T5>,
        any[], T6, Ctor<T6>,
        any[], T7, Ctor<T7>,
        any[], T8, Ctor<T8>,
        any[], T9, Ctor<T9>
    >> : never;

type MixinRet10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> = IsSafeIntersection<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]> extends true ?
    ReturnType<typeof Mixin<
        any[], T1, Ctor<T1>,
        any[], T2, Ctor<T2>,
        any[], T3, Ctor<T3>,
        any[], T4, Ctor<T4>,
        any[], T5, Ctor<T5>,
        any[], T6, Ctor<T6>,
        any[], T7, Ctor<T7>,
        any[], T8, Ctor<T8>,
        any[], T9, Ctor<T9>,
        any[], T10, Ctor<T10>
    >> : never;

function safeMixin2<T1, T2>(C1: Ctor<T1>, C2: Ctor<T2>) {
    return <MixinRet2<T1, T2>>Mixin(C1, C2);
}

function safeMixin3<T1, T2, T3>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>) {
    return <MixinRet3<T1, T2, T3>>Mixin(C1, C2, C3);
}

function safeMixin4<T1, T2, T3, T4>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>) {
    return <MixinRet4<T1, T2, T3, T4>>Mixin(C1, C2, C3, C4);
}

function safeMixin5<T1, T2, T3, T4, T5>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>, C5: Ctor<T5>) {
    return <MixinRet5<T1, T2, T3, T4, T5>>Mixin(C1, C2, C3, C4, C5);
}

function safeMixin6<T1, T2, T3, T4, T5, T6>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>, C5: Ctor<T5>, C6: Ctor<T6>) {
    return <MixinRet6<T1, T2, T3, T4, T5, T6>>Mixin(C1, C2, C3, C4, C5, C6);
}

function safeMixin7<T1, T2, T3, T4, T5, T6, T7>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>, C5: Ctor<T5>, C6: Ctor<T6>, C7: Ctor<T7>) {
    return <MixinRet7<T1, T2, T3, T4, T5, T6, T7>>Mixin(C1, C2, C3, C4, C5, C6, C7);
}

function safeMixin8<T1, T2, T3, T4, T5, T6, T7, T8>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>, C5: Ctor<T5>, C6: Ctor<T6>, C7: Ctor<T7>, C8: Ctor<T8>) {
    return <MixinRet8<T1, T2, T3, T4, T5, T6, T7, T8>>Mixin(C1, C2, C3, C4, C5, C6, C7, C8);
}

function safeMixin9<T1, T2, T3, T4, T5, T6, T7, T8, T9>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>, C5: Ctor<T5>, C6: Ctor<T6>, C7: Ctor<T7>, C8: Ctor<T8>, C9: Ctor<T9>) {
    return <MixinRet9<T1, T2, T3, T4, T5, T6, T7, T8, T9>>Mixin(C1, C2, C3, C4, C5, C6, C7, C8, C9);
}

function safeMixin10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>, C5: Ctor<T5>, C6: Ctor<T6>, C7: Ctor<T7>, C8: Ctor<T8>, C9: Ctor<T9>, C10: Ctor<T10>) {
    return <MixinRet10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>>Mixin(C1, C2, C3, C4, C5, C6, C7, C8, C9, C10);
}

export function safeMixin<T1, T2>(C1: Ctor<T1>, C2: Ctor<T2>): MixinRet2<T1, T2>;
export function safeMixin<T1, T2, T3>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>): MixinRet3<T1, T2, T3>;
export function safeMixin<T1, T2, T3, T4>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>): MixinRet4<T1, T2, T3, T4>;
export function safeMixin<T1, T2, T3, T4, T5>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>, C5: Ctor<T5>): MixinRet5<T1, T2, T3, T4, T5>;
export function safeMixin<T1, T2, T3, T4, T5, T6>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>, C5: Ctor<T5>, C6: Ctor<T6>): MixinRet6<T1, T2, T3, T4, T5, T6>;
export function safeMixin<T1, T2, T3, T4, T5, T6, T7>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>, C5: Ctor<T5>, C6: Ctor<T6>, C7: Ctor<T7>): MixinRet7<T1, T2, T3, T4, T5, T6, T7>;
export function safeMixin<T1, T2, T3, T4, T5, T6, T7, T8>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>, C5: Ctor<T5>, C6: Ctor<T6>, C7: Ctor<T7>, C8: Ctor<T8>): MixinRet8<T1, T2, T3, T4, T5, T6, T7, T8>;
export function safeMixin<T1, T2, T3, T4, T5, T6, T7, T8, T9>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>, C5: Ctor<T5>, C6: Ctor<T6>, C7: Ctor<T7>, C8: Ctor<T8>, C9: Ctor<T9>): MixinRet9<T1, T2, T3, T4, T5, T6, T7, T8, T9>;
export function safeMixin<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(C1: Ctor<T1>, C2: Ctor<T2>, C3: Ctor<T3>, C4: Ctor<T4>, C5: Ctor<T5>, C6: Ctor<T6>, C7: Ctor<T7>, C8: Ctor<T8>, C9: Ctor<T9>, C10: Ctor<T10>): MixinRet10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>;
export function safeMixin<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(C1: Ctor<T1>, C2: Ctor<T2>, C3?: Ctor<T3>, C4?: Ctor<T4>, C5?: Ctor<T5>, C6?: Ctor<T6>, C7?: Ctor<T7>, C8?: Ctor<T8>, C9?: Ctor<T9>, C10?: Ctor<T10>) {
    if (!C3) {
        return safeMixin2(C1, C2);
    } else if (!C4) {
        return safeMixin3(C1, C2, C3);
    } else if (!C5) {
        return safeMixin4(C1, C2, C3, C4);
    } else if (!C6) {
        return safeMixin5(C1, C2, C3, C4, C5);
    } else if (!C7) {
        return safeMixin6(C1, C2, C3, C4, C5, C6);
    } else if (!C8) {
        return safeMixin7(C1, C2, C3, C4, C5, C6, C7);
    } else if (!C9) {
        return safeMixin8(C1, C2, C3, C4, C5, C6, C7, C8);
    } else if (!C10) {
        return safeMixin9(C1, C2, C3, C4, C5, C6, C7, C8, C9);
    } else {
        return safeMixin10(C1, C2, C3, C4, C5, C6, C7, C8, C9, C10);
    }
}
