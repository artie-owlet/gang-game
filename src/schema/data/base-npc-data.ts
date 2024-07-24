import ss from 'superstruct';

import type { FlavoredString } from '../../utils/flavored-string';

export function defineBaseNpcDataSchema<T extends string>(id: ss.Struct<FlavoredString<T>, null>) {
    return ss.object({
        id,
        name: ss.string(),
    });
}

const baseNpcDataSchema = defineBaseNpcDataSchema(ss.string());

export type BaseNpcData<T extends string> = ss.Infer<ReturnType<typeof defineBaseNpcDataSchema<T>>>;

export function isBaseNpcData<T extends string>(data: unknown): data is BaseNpcData<T> {
    return ss.is(data, baseNpcDataSchema);
}
