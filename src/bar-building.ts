import { EmptyBuilding } from './empty-building';
import type { GameContext } from './game-context';
import type { Person } from './person';
import { isBarBuildingData, type BarBuildingData } from './schema/data/bar-building-data';
import type { BarBuildingConfig, BarBuildingType } from './schema/rules/bar-building-config';

type CtorArgs = [BarBuildingData, GameContext] | [
    building: EmptyBuilding,
    type: BarBuildingType,
    game: GameContext,
];

function isLoadCtorArgs(args: CtorArgs): args is [BarBuildingData, GameContext] {
    return isBarBuildingData(args[0]);
}

export class BarBuilding extends EmptyBuilding {
    public readonly type: BarBuildingType;
    public readonly manager: Person | null;

    private game: GameContext;

    public constructor(...args: CtorArgs) {
        if (isLoadCtorArgs(args)) {
            const [data, game] = args;
            super(data, game);
            this.type = data.type;
            this.manager = data.managerId ? game.person(data.managerId) : null;
            this.game = game;
        } else {
            const [building, type, game] = args;
            super(building);
            this.type = type;
            this.manager = null;
            this.game = game;
        }
    }

    public get config(): Readonly<BarBuildingConfig> {
        return this.game.rules.barBuildingConfig(this.type);
    }

    public update(): void {
        this.config.goods.forEach(({ resourceType, amount, price }) => {
            const maxAmount = this.storage.getResourceAmount(resourceType);
            if (amount > maxAmount) {
                this.storage.takeResource(resourceType, maxAmount);
                this.wallet.addMoney(maxAmount * price);
            } else {
                this.storage.takeResource(resourceType, amount);
                this.wallet.addMoney(amount * price);
            }
        });
    }
}
