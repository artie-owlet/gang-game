export class Wallet {
    public constructor(
        private money_: number,
    ) {
    }

    public get money(): number {
        return this.money_;
    }

    public addMoney(sum: number): void {
        this.money_ += sum;
    }

    public takeMoney(sum: number): void {
        if (sum > this.money_) {
            throw new Error(`Cannot take ${sum} of money`);
        }
        this.money_ -= sum;
    }
}
