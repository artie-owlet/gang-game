import ss from 'superstruct';

const generalConfigSchena = ss.object({
    buildingCapacity: ss.number(),
});

export type GeneralConfig = ss.Infer<typeof generalConfigSchena>;
