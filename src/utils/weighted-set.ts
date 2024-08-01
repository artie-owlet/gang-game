import ss from 'superstruct';

export const weightedSetSchema = ss.array(ss.object({
    value: ss.number(),
    weight: ss.number(),
}));

export type WeightedSet = ss.Infer<typeof weightedSetSchema>;
