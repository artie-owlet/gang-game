import ss from 'superstruct';

export enum GangsterPerks {
    barAmountMultAdd = 'barAmountMultAdd',
    barPriceMultAdd = 'barPriceMultAdd',
    prodInputsAmountMultSub = 'prodInputsAmountMultSub',
    prodProductAmountMultAdd = 'prodProductAmountMultAdd',
    prodTimeValueSub = 'prodTimeValueSub',
    driverDrivePointsAddValue = 'driverDrivePointsAddValue',
}

export const gangsterPerksSchema = ss.enums(Object.values(GangsterPerks));

export const gangsterPerksConfigSchema = ss.record(
    gangsterPerksSchema,
    ss.array(ss.number()),
);

export type GangsterPerksConfig = ss.Infer<typeof gangsterPerksConfigSchema>;
