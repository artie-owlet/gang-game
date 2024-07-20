import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../../utils/flavored-string';

export const personIdSchema = defineFlavoredStringSchema('PersonId');

export type PersonId = ss.Infer<typeof personIdSchema>;

export const personDataSchema = ss.object({
    id: personIdSchema,
    name: ss.string(),
});

export type PersonData = ss.Infer<typeof personDataSchema>;

export function isPersonData(data: unknown): data is PersonData {
    return ss.is(data, personDataSchema);
}
