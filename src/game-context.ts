import type { City } from './city';
import type { Person } from './person';
import type { PersonId } from './schema/data/person-data';
import type { VehicleId } from './schema/data/vehicle-data';
import type { BarBuildingConfig, BarBuildingType } from './schema/rules/bar-building-config';
import type { GeneralConfig } from './schema/rules/general-config';
import type {
    ProductionBuildingConfig,
    ProductionBuildingType,
    ProductionReceipe,
} from './schema/rules/production-building-config';
import type { ResourceConfig, ResourceType } from './schema/rules/resource-config';
import type { VehicleConfig, VehicleType } from './schema/rules/vehicle-confg';
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
