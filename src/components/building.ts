import ss from 'superstruct';

import { createBaseClass } from '../utils/create-base-class';

export const buildingSchema = ss.object({
    position: ss.number(),
    buildingName: ss.string(),
});

type BuildingData = ss.Infer<typeof buildingSchema>;

export abstract class Building extends createBaseClass<BuildingData>() {}
