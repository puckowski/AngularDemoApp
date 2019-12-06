import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class SubscriberGeneric implements OnDestroy {

    private subscriptionArray: Array<Subscription>;

    constructor() {
        this.subscriptionArray = new Array<Subscription>();
    }

    ngOnDestroy(): void {
        this.subscriptionArray.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        })
    }

    public pushAutoUnsubscribe(subscription: Subscription): void {
        this.subscriptionArray.push(subscription);
    }

    public pushAutoUnsubscribeArray(subscriptionArray: Array<Subscription>): void {
        this.subscriptionArray.concat(subscriptionArray);
    }
}
