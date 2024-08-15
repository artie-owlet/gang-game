import ss from 'superstruct';

export const buildingSchema = ss.object({
    position: ss.number(),
    buildingName: ss.string(),
});

type BuildingData = ss.Infer<typeof buildingSchema>;

export interface Building extends BuildingData {
}

export abstract class Building {
    public static create(position: number, buildingName: string): BuildingData {
        return {
            position,
            buildingName,
        };
    }
}
