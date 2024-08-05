import ss from 'superstruct';

export const buildingSchema = ss.object({
    position: ss.number(),
    buildingName: ss.string(),
});
