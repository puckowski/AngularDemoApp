import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';
import { DataHelper } from '@app/helpers/data-helper.helper';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService) {

    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
                /*
                 * Automatically logout if 401 response returned from API.
                 */
                this.authenticationService.logout();
                location.reload();
            }

            let error: string = err.error.message;

            if (DataHelper.isDefined(error) === false) {
                error = err.statusText;
            }

            return throwError(error);
        }));
    }
}
