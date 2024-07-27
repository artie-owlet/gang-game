import type { City } from './city';
import type { Gangster } from './gangster';
import type { GangsterId } from './schema/data/gangster-data';
import type { TraderId } from './schema/data/trader-data';
import type { VehicleId } from './schema/data/vehicle-data';
import type { BarBuildingConfig, BarBuildingType } from './schema/rules/bar-building-config';
import type { GeneralConfig } from './schema/rules/general-config';
import type {
    ProductionBuildingConfig,
    ProductionBuildingType,
    ProductionReceipe,
} from './schema/rules/production-building-config';
import type { ResourceConfig, ResourceType } from './schema/rules/resource-config';
import type { TraderConfig, TraderType } from './schema/rules/trader-type-config';
import type { VehicleConfig, VehicleType } from './schema/rules/vehicle-confg';
import type { Trader } from './trader';
import type { Rng } from './utils/random';
import type { Vehicle } from './vehicle';

export interface Rules {
    generalConfig: Readonly<GeneralConfig>;
    barBuildingConfig(barBuildingType: BarBuildingType): Readonly<BarBuildingConfig>;
    productionBuildingConfig(productionBuildingType: ProductionBuildingType): Readonly<ProductionBuildingConfig>;
    productionReceipe(productionBuildingType: ProductionBuildingType, receipeId: number): Readonly<ProductionReceipe>;
    resourceConfig(resourceType: ResourceType): Readonly<ResourceConfig>;
    traderConfig(traderType: TraderType): Readonly<TraderConfig>;
    vehicleConfig(vehicleType: VehicleType): Readonly<VehicleConfig>;
}

export interface Randomizer {
    rng: Rng;
    randomBuildingName(): string;
    randomCornerName(): string;
    randomPersonName(): string;
}

export interface GameContext {
    rules: Rules;
    randomizer: Randomizer;

    city: City;
    gangster(id: GangsterId): Gangster;
    trader(id: TraderId): Trader;
    vehicle(id: VehicleId): Vehicle;
}
