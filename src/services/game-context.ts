import type { ResourceConfig, ResourceType } from '../rules/resource-config';

export interface Rules {
    // generalConfig: Readonly<GeneralConfig>;
    // barBuildingConfig(barBuildingType: BarBuildingType): Readonly<BarBuildingConfig>;
    // productionBuildingConfig(productionBuildingType: ProductionBuildingType): Readonly<ProductionBuildingConfig>;
    // productionReceipe(productionBuildingType: ProductionBuildingType, receipeId: number): Readonly<ProductionReceipe>;
    resourceConfig(resourceType: ResourceType): Readonly<ResourceConfig>;
    // traderConfig(traderType: TraderType): Readonly<TraderConfig>;
    // vehicleConfig(vehicleType: VehicleType): Readonly<VehicleConfig>;
}

export interface GameContext {
    rules: Rules;
}
