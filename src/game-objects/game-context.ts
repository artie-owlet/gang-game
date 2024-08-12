import type { GenderType, PhotoId } from '../components/person';
import type { BarConfig, BarType } from '../rules/bar-config';
import type { GangsterPerksConfig } from '../rules/gangster-perks-config';
import type { ProductionConfig, ProductionType } from '../rules/production-config';
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

    gangsterPerksConfig: Readonly<GangsterPerksConfig>;

    barConfigs: Record<BarType, Readonly<BarConfig>>;
    barConfig(barType: BarType): Readonly<BarConfig>;

    productionConfigs: Record<ProductionType, Readonly<ProductionConfig>>;
    productionConfig(productionType: ProductionType): Readonly<ProductionConfig>;

    resourceConfigs: Record<ResourceType, Readonly<ResourceConfig>>;
    resourceConfig(resourceType: ResourceType): Readonly<ResourceConfig>;
}

export interface GameContext {
    randomizer: Randomizer;
    rules: Rules;

    gangster(id: GangsterId): Gangster;
}
