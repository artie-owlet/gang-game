import ss from 'superstruct';

// [unluck, luck]
export const oddsSchema = ss.tuple([
    ss.number(),
    ss.number(),
]);

export type Odds = ss.Infer<typeof oddsSchema>;
