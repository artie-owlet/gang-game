import type { City } from './city';
import type { BarBuildingConfig, BarBuildingType } from './data/bar-building-config';
import type { GeneralConfig } from './data/general-config-data';
import type { PersonId } from './data/person-data';
import type {
    ProductionBuildingConfig,
    ProductionBuildingType,
    ProductionReceipe,
} from './data/production-building-config';
import type { ResourceConfig, ResourceType } from './data/resource-config';
import type { VehicleConfig, VehicleType } from './data/vehicle-confg';
import type { VehicleId } from './data/vehicle-data';
import type { Person } from './person';
import type { Randomizer } from './utils/random';
import type { Vehicle } from './vehicle';

export interface GameContext extends Randomizer {
    city: City;

    generalConfig: Readonly<GeneralConfig>;
    barBuildingConfig(barBuildingType: BarBuildingType): Readonly<BarBuildingConfig>;
    productionBuildingConfig(productionBuildingType: ProductionBuildingType): Readonly<ProductionBuildingConfig>;
    productionReceipe(productionBuildingType: ProductionBuildingType, receipeId: number): Readonly<ProductionReceipe>;
    resourceConfig(resourceType: ResourceType): Readonly<ResourceConfig>;
    vehicleConfig(vehicleType: VehicleType): Readonly<VehicleConfig>;

    randomBuildingName(): string;
    randomCornerName(): string;
    randomPersonName(): string;

    person(id: PersonId): Person;
    vehicle(id: VehicleId): Vehicle;
}
