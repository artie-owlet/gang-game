import ss from 'superstruct';

import { defineFlavoredStringSchema } from '../utils/flavored-string';

export const relsEventTypeSchema = defineFlavoredStringSchema('RelsEventType');

export type RelsEventType = ss.Infer<typeof relsEventTypeSchema>;

export const relationshipsConfigSchema = ss.record(
    relsEventTypeSchema,
    ss.object({
        respect: ss.integer(),
        fear: ss.integer(),
        time: ss.integer(),
    }),
);

export type RelationshipsConfig = ss.Infer<typeof relationshipsConfigSchema>;
