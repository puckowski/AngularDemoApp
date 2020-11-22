import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '@app/models/user.model';
import { DataHelper } from '@app/helpers/data-helper.helper';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService) {

    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (DataHelper.isDefined(request.headers.get('Authorization')) === true) {
            /*
             * Some requests do not support Authorization header. If it is already set, remove it.
             */
            let cleanedHeaders: HttpHeaders = request.headers;
            cleanedHeaders = cleanedHeaders.delete('Authorization');

            request = request.clone({
                headers: cleanedHeaders
            });
        } else {
            /*
             * Add authorization header with JWT token if available.
             */
            const currentUser: User = this.authenticationService.currentUserValue;
            if (DataHelper.isDefined(currentUser) === true && DataHelper.isDefined(currentUser.token) === true) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
            }
        }

        return next.handle(request);
    }
}
