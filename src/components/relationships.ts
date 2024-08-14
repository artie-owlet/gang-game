import ss from 'superstruct';

import { relsEventTypeSchema, type RelsEventType } from '../rules/relationships-config';
import { updateComponent } from '../utils/game-object-class-factory';
import { recordValue } from '../utils/record-utils';
import type { WithContext } from './with-context';

/**
 * Relationships consist of respect (R) and fear (F)
 * R and F must satisfy the expression
 * `((100 - R) / (100 - R0)) ** 2 + ((100 - F) / (100 - F0)) ** 2 >= 1`
 * except for cases when R <= R0 || F <= F0
 *
 * * R0 - max R at which F can be 100
 * * F0 - max F at which R can be 100
 */

export function calcRelationshipsLimitCurve(r0: number, f0: number): number[] {
    const curve: number[] = [];
    for (let r = 0; r <= 100; ++r) {
        if (r <= r0) {
            curve.push(100);
        } else {
            curve.push(100 - Math.sqrt(1 - ((100 - r) / (100 - r0)) ** 2) * (100 - f0) | 0);
        }
    }
    return curve;
}

export const relationshipsSchema = ss.object({
    respect: ss.number(),
    fear: ss.number(),
    relsEventsCountDown: ss.map(relsEventTypeSchema, ss.number()),
});

export interface Relationships extends ss.Infer<typeof relationshipsSchema>, WithContext {
}

export abstract class Relationships {
    public setRelsEvent(eventType: RelsEventType): void {
        this.relsEventsCountDown.set(eventType, recordValue(this.ctx.rules.relationshipsConfig, eventType).time);
        this.refreshRelsValue();
    }

    public [updateComponent](): void {
        this.relsEventsCountDown.forEach((countDown, eventType) => {
            if (countDown === 1) {
                this.relsEventsCountDown.delete(eventType);
            } else {
                this.relsEventsCountDown.set(eventType, countDown - 1);
            }
        });
        this.refreshRelsValue();
    }

    private refreshRelsValue(): void {
        this.respect = 0;
        this.fear = 0;
        Object.keys(this.relsEventsCountDown).forEach((eventType) => {
            const { respect, fear } = recordValue(this.ctx.rules.relationshipsConfig, eventType);
            this.respect += respect;
            this.fear += fear;
        });

        if (this.respect > 100) {
            this.respect = 100;
        }
        if (this.fear > 100) {
            this.fear = 100;
        }

        const curve = this.ctx.rules.relationshipsLimitCurve;
        const k = this.respect / this.fear;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        while (this.fear > curve[this.respect]!) {
            --this.respect;
            this.fear = this.respect * k | 0;
        }
    }
}
