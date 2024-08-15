import ss from 'superstruct';

export const walletSchema = ss.object({
    money: ss.number(),
});

type WalletData = ss.Infer<typeof walletSchema>;

export interface Wallet extends WalletData {
}

export abstract class Wallet {
    public static create(): WalletData {
        return {
            money: 0,
        };
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
