import ss from 'superstruct';

import type { FlavoredString } from '../../utils/flavored-string';

export function defineBaseBuildingDataSchema<T extends string>(id: ss.Struct<FlavoredString<T>, null>) {
    return ss.object({
        id,
        name: ss.string(),
    });
}

const baseBuildingDataSchema = defineBaseBuildingDataSchema(ss.string());

export type BaseBuildingData<T extends string> = ss.Infer<ReturnType<typeof defineBaseBuildingDataSchema<T>>>;

export function isBaseBuildingData<T extends string>(data: unknown): data is BaseBuildingData<T> {
    return ss.is(data, baseBuildingDataSchema);
}
