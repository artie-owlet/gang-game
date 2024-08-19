import type { GenderType, PhotoId } from '../components/person';
import type { BarConfig, BarType } from '../rules/bar-config';
import type { GangsterPerksConfig } from '../rules/gangster-perks-config';
import type { GeneralConfig } from '../rules/general-config';
import type { ProductionConfig, ProductionType } from '../rules/production-config';
import type { RelationshipsConfig } from '../rules/relationships-config';
import type { ResourceConfig, ResourceType } from '../rules/resource-config';
import type { TraderConfig, TraderType } from '../rules/trader-config';
import type { VehicleConfig, VehicleType } from '../rules/vehicle-config';
import type { Rng } from '../utils/random';
import type { Bar, BarId } from './bar';
import type { EmptyBuilding, EmptyBuildingId } from './empty-building';
import type { Gangster, GangsterId } from './gangster';
import type { GangsterVehicle, GangsterVehicleId } from './gangster-vehicle';
import type { Production, ProductionId } from './production';
import type { StreetMap } from './street-map';
import type { Warehouse, WarehouseId } from './warehouse';

export interface Randomizer {
    rng: Rng;
    personName(gender: GenderType): string;
    photo(gender: GenderType): PhotoId;
    buildingName(): string;
}

export interface Rules {
    generalConfig: Readonly<GeneralConfig>;

    gangsterPerksConfig: Readonly<GangsterPerksConfig>;
    relationshipsConfig: Readonly<RelationshipsConfig>;
    relationshipsLimitCurve: readonly number[];

    barConfigs: Record<BarType, Readonly<BarConfig>>;
    barConfig(barType: BarType): Readonly<BarConfig>;

    productionConfigs: Record<ProductionType, Readonly<ProductionConfig>>;
    productionConfig(productionType: ProductionType): Readonly<ProductionConfig>;

    resourceConfigs: Record<ResourceType, Readonly<ResourceConfig>>;
    resourceConfig(resourceType: ResourceType): Readonly<ResourceConfig>;

    traderConfigs: Record<TraderType, Readonly<TraderConfig>>;
    traderConfig(traderType: TraderType): Readonly<TraderConfig>;

    vehicleConfigs: Record<VehicleType, Readonly<VehicleConfig>>;
    vehicleConfig(vehicleType: VehicleType): Readonly<VehicleConfig>;
}

export interface GameContext {
    randomizer: Randomizer;
    rules: Rules;

    streetMap: StreetMap;

    gangsters: Gangster[];
    gangster(id: GangsterId): Gangster;
    addGangster(gangster: Gangster): void;

    gangsterVehicles: GangsterVehicle[];
    gangsterVehicle(id: GangsterVehicleId): GangsterVehicle;
    addGangsterVehicle(vehicle: GangsterVehicle): void;

    emptyBuildings: EmptyBuilding[];
    emptyBuilding(id: EmptyBuildingId): EmptyBuilding;
    addEmptyBuilding(building: EmptyBuilding): void;

    bars: Bar[];
    bar(id: BarId): Bar;
    buildBar(bar: Bar): void;
    demolishBar(building: EmptyBuilding): void;

    productions: Production[];
    production(id: ProductionId): Production;
    buildProduction(production: Production): void;
    demolishProduction(building: EmptyBuilding): void;

    warehouses: Warehouse[];
    warehouse(id: WarehouseId): Warehouse;
    buildWarehouse(warehouse: Warehouse): void;
}
