import ss from 'superstruct';

export const cornerDataSchema = ss.object({
    name: ss.string(),
    explored: ss.boolean(),
});

export type CornerData = ss.Infer<typeof cornerDataSchema>;

export function isCornerData(data: unknown): data is CornerData {
    return ss.is(data, cornerDataSchema);
}
