import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { DataHelper } from '@app/helpers/data-helper.helper';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthenticationService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (DataHelper.isDefined(currentUser) === true) {
            /*
             * Logged in.
             */
            return true;
        }

        /*
         * Not logged in. Redirect to login page with the return url.
         */
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });

        return false;
    }
}
