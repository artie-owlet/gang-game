import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../../utils/flavored-string';
import { defineBasePersonDataSchema } from './base-person-data';

export const gangsterIdSchema = defineFlavoredStringSchema('GangsterId');

export type GangsterId = ss.Infer<typeof gangsterIdSchema>;

export const gangsterDataSchema = ss.intersection([
    defineBasePersonDataSchema(gangsterIdSchema),
    ss.object({}),
]);

export type GangsterData = ss.Infer<typeof gangsterDataSchema>;

export function isGangsterData(data: unknown): data is GangsterData {
    return ss.is(data, gangsterDataSchema);
}
