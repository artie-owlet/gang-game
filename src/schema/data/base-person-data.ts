import ss from 'superstruct';

import type { FlavoredString } from '../../utils/flavored-string';

export function defineBasePersonDataSchema<T extends string>(id: ss.Struct<FlavoredString<T>, null>) {
    return ss.object({
        id,
        name: ss.string(),
    });
}

const basePersonDataSchema = defineBasePersonDataSchema(ss.string());

export type BasePersonData<T extends string> = ss.Infer<ReturnType<typeof defineBasePersonDataSchema<T>>>;

export function isBasePersonData<T extends string>(data: unknown): data is BasePersonData<T> {
    return ss.is(data, basePersonDataSchema);
}
