import ss from 'superstruct';

export const oddsSchema = ss.tuple([
    ss.number(),
    ss.number(),
]);

export type Odds = ss.Infer<typeof oddsSchema>;
