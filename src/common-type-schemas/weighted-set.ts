import ss from 'superstruct';

export function defineWeightedSetSchema<T>(schema: ss.Struct<T, null>) {
    return ss.array(ss.tuple([schema, ss.number()]));
}

export type WeightedSet<T> = ss.Infer<ReturnType<typeof defineWeightedSetSchema<T>>>;

export const weightedNumberSetSchema = defineWeightedSetSchema(ss.number());
