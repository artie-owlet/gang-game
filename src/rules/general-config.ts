import ss from 'superstruct';

export const generalConfigSchema = ss.object({
    relationshipsParams: ss.object({
        respectOffset: ss.min(ss.max(ss.number(), 100), 0),
        fearOffset: ss.min(ss.max(ss.number(), 100), 0),
    }),
    warehouseCapacity: ss.number(),
});

export type GeneralConfig = ss.Infer<typeof generalConfigSchema>;
