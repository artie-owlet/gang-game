import ss from 'superstruct';

import { defineFlavoredStringSchema, type FlavoredString } from '../../utils/flavored-string';

const photoIdSchema = defineFlavoredStringSchema('PhotoId');

export type PhotoId = ss.Infer<typeof photoIdSchema>;

export function defineBasePersonDataSchema<T extends string>(id: ss.Struct<FlavoredString<T>, null>) {
    return ss.object({
        id,
        name: ss.string(),
        photoId: photoIdSchema,
    });
}

const basePersonDataSchema = defineBasePersonDataSchema(ss.string());

export type BasePersonData<T extends string> = ss.Infer<ReturnType<typeof defineBasePersonDataSchema<T>>>;

export function isBasePersonData<T extends string>(data: unknown): data is BasePersonData<T> {
    return ss.is(data, basePersonDataSchema);
}
