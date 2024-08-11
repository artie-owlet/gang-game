import ss from 'superstruct';

export enum GangsterPerks {
    barAmountAdd = 'barAmountAdd',
    barPriceAdd = 'barPriceAdd',
}

export const gangsterPerksSchema = ss.enums(Object.values(GangsterPerks));

export const gangsterPerksConfigSchema = ss.record(
    gangsterPerksSchema,
    ss.array(ss.number()),
);

export type GangsterPerksConfig = ss.Infer<typeof gangsterPerksConfigSchema>;
