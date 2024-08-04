import ss from 'superstruct';

import { createBaseClass } from '../utils/create-base-class';

export const walletSchema = ss.object({
    money: ss.number(),
});

type WalletData = ss.Infer<typeof walletSchema>;

export abstract class Wallet extends createBaseClass<WalletData>() {
    public addMoney(sum: number): void {
        this.money += sum;
    }

    public takeMoney(sum: number): void {
        if (sum > this.money) {
            throw new Error(`Cannot take ${sum} of money`);
        }
        this.money -= sum;
    }
}
