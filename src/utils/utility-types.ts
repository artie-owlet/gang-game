export type ArrayItemType<T extends ArrayLike<unknown>> = T extends ArrayLike<infer I> ? I : never;

export type PartialFields<T extends object, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
