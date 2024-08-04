import type { GenderType, PhotoId } from '../components/person';
import type { BarConfig, BarType } from '../rules/bar-config';
import type { ResourceConfig, ResourceType } from '../rules/resource-config';
import type { Rng } from '../utils/random';
import type { Gangster, GangsterId } from './gangster';

export interface Randomizer {
    rng: Rng;
    personName(gender: GenderType): string;
    photo(gender: GenderType): PhotoId;
}

export interface Rules {
    // generalConfig: Readonly<GeneralConfig>;
    barConfig(barType: BarType): Readonly<BarConfig>;
    // productionBuildingConfig(productionBuildingType: ProductionBuildingType): Readonly<ProductionBuildingConfig>;
    // productionReceipe(productionBuildingType: ProductionBuildingType, receipeId: number): Readonly<ProductionReceipe>;
    resourceConfig(resourceType: ResourceType): Readonly<ResourceConfig>;
    // traderConfig(traderType: TraderType): Readonly<TraderConfig>;
    // vehicleConfig(vehicleType: VehicleType): Readonly<VehicleConfig>;
}

export interface GameContext {
    randomizer: Randomizer;
    rules: Rules;

    gangster(id: GangsterId): Gangster;
}
