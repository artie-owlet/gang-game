import ss from 'superstruct';

export const buildingSchema = ss.object({
    position: ss.integer(),
});

type BuildingData = ss.Infer<typeof buildingSchema>;

export interface Building extends BuildingData {
}

export abstract class Building {
    // public static create(position: number): BuildingData {
    //     return {
    //         position,
    //     };
    // }
}
