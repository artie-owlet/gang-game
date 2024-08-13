import ss from 'superstruct';

export const generalConfigSchema = ss.object({
    relationshipsParams: ss.tuple([ss.number(), ss.number(), ss.number()]),
});

export type GeneralConfig = ss.Infer<typeof generalConfigSchema>;
