import ss from 'superstruct';

import { createBaseClass } from '../utils/create-base-class';

const walletSchema = ss.object({
    money: ss.number(),
});

type WalletData = ss.Infer<typeof walletSchema>;

class Wallet extends createBaseClass<WalletData>() {
    public constructor(data: WalletData) {
        super(data);
    }

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

export const walletComponentSchema = ss.object({
    wallet: walletSchema,
});

type WalletComponentData = ss.Infer<typeof walletComponentSchema>;

export class WalletComponent {
    public wallet: Wallet;

    public constructor({ wallet }: WalletComponentData) {
        this.wallet = new Wallet(wallet);
    }
}
