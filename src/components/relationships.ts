import ss from 'superstruct';

import type { WithContext } from './with-context';

/**
 * Relationships consist of respect (R) and fear (F)
 * R and F must satisfy the expression
 * `(R + A) * (F + B) <= C`
 * except for cases when R or F = 0
 *
 * Params A, B, C are calculated from the system of equations
 * ```
 * (0 + A) * (F0 + B) = C
 * (50 + A) * (F50 + B) = C
 * (100 + A) * (F100 + B) = C
 * ```
 * where F0, F50, F100 are fear for respect = 0, 50, 100
 */

export function calcRelationshipsParams([f0, f50, f100]: [number, number, number]): [number, number, number] {
    const denom = f0 + f100 - 2 * f50;
    return [
        100 * (f50 - f100) / denom,
        (f50 * (f0 + f100) - 2 * f0 * f100) / denom,
        100 * (f0 - f50) * (f0 - f100) * (f50 - f100) / denom,
    ];
}

export const relationshipsSchema = ss.object({
    respect: ss.min(ss.max(ss.number(), 100), 0),
    fear: ss.min(ss.max(ss.number(), 100), 0),
});

export interface Relationships extends ss.Infer<typeof relationshipsSchema>, WithContext {
}

export abstract class Relationships {
    public increaseRespect(value: number): void {
        this.respect += value;
        if (this.respect > 100) {
            this.respect = 100;
        }

        if (!this.isValidRelationshipsValues) {
            const [a, b, c] = this.ctx.rules.generalConfig.relationshipsParams;
            this.fear = c / (this.respect + a) - b | 0;
            if (this.fear < 0) {
                this.fear = 0;
            }
        }
    }

    public decreaseRespect(value: number): void {
        this.respect - value;
        if (this.respect < 0) {
            this.respect = 0;
        }
    }

    public increaseFear(value: number): void {
        this.fear += value;
        if (this.fear > 100) {
            this.fear = 100;
        }

        if (!this.isValidRelationshipsValues) {
            const [a, b, c] = this.ctx.rules.generalConfig.relationshipsParams;
            this.respect = c / (this.fear + b) - a | 0;
            if (this.respect < 0) {
                this.respect = 0;
            }
        }
    }

    public decreaseFear(value: number): void {
        this.fear - value;
        if (this.fear < 0) {
            this.fear = 0;
        }
    }

    private get isValidRelationshipsValues(): boolean {
        const [a, b, c] = this.ctx.rules.generalConfig.relationshipsParams;
        return (this.respect + a) * (this.fear + b) <= c;
    }
}
