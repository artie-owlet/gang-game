import ss from 'superstruct';

import { cornerDataSchema } from './corner-data';

export const cityDataSchema = ss.object({
    size: ss.number(),
    corners: ss.array(cornerDataSchema),
    borders: ss.array(ss.number()),
});

export type CityData = ss.Infer<typeof cityDataSchema>;

export function isCityData(data: unknown): data is CityData {
    return ss.is(data, cityDataSchema);
}
