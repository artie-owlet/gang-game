import ss from 'superstruct';

export const buildingSchema = ss.object({
    position: ss.number(),
    buildingName: ss.string(),
});

export interface Building extends ss.Infer<typeof buildingSchema> {
}

export abstract class Building {
}
