import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { PlannedPart } from '@app/models/planned-part.model';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Observable, throwError, of, interval } from 'rxjs';
import { LoggerService } from '../logger.service';
import { environment } from '@environments/environment';
import { PartNote } from '@app/models/part-note.model';
import { RefreshResponse } from '@app/models/refresh-response.model';
import { DataHelper } from '@app/helpers/data-helper.helper';
import { AuthenticationService } from '../authentication.service';
import { User, AuthorizationLevel } from '@app/models/user.model';
import { LoginResponse } from '@app/models/login-response.model';
import { ToastService } from '../toast.service';
import { RoutingService } from '../routing.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private readonly TOKEN_REFRESH_INTERVAL_MILLIS: number = 1800000; // 30 minutes
  private readonly USER_PLANNER: User = {
    id: 1,
    username: 'planner',
    password: 'planner',
    firstName: 'Test',
    lastName: 'User',
    authorizationLevel: AuthorizationLevel.AUTHORIZATION_PLANNER
  };

  private refreshInterval: Observable<number>;

  constructor(private http: HttpClient, private loggerService: LoggerService, private routingService: RoutingService,
              private authenticationService: AuthenticationService, private toastService: ToastService) {
    this.refreshToken();

    this.refreshInterval = interval(this.TOKEN_REFRESH_INTERVAL_MILLIS);
    this.refreshInterval.subscribe((refreshCount: number) => {
      this.refreshToken();
    });
  }

  public refreshToken(): void {
    if (DataHelper.isDefined(this.authenticationService.currentUserValue) === false) {
      /*
       * No user to check for possible token.
       */
      return;
    } else if (DataHelper.isDefined(this.authenticationService.currentUserValue) === true
      && DataHelper.isDefined(this.authenticationService.currentUserValue.token) === false) {
      /*
       * User is not a JWT based user.
       */
      return;
    }

    this.http.get(`${environment.apiRefreshToken}`)
      .subscribe((resp: RefreshResponse) => {
        if (DataHelper.isDefined(resp.token) === true) {
          /*
           * Store user details and JWT token in local storage to keep user logged in between page refreshes.
           */
          this.USER_PLANNER.token = resp.token;
          localStorage.setItem('currentUser', JSON.stringify(this.USER_PLANNER));
          this.authenticationService.setUser(this.USER_PLANNER);
        } else {
          this.authenticationService.logout();
          this.toastService.toast('Session timed out. Please login again.');
          this.routingService.navigateLogin();
        }
      }, (error: HttpErrorResponse) => {
        this.authenticationService.logout();
        this.toastService.toast('Session timed out. Please login again.');
        this.routingService.navigateLogin();
      });
  }

  public login(username: string, password: string): Observable<User> {
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
      .pipe(flatMap((user: User) => {
        if (DataHelper.isDefined(user) === false) {
          return this.http.post<any>(`${environment.apiLambdaLogin}`, { username, password })
            .pipe(map((resp: LoginResponse) => {
              if (DataHelper.isDefined(resp.token) === true) {
                /*
                 * Store user details and JWT token in local storage to keep user logged in between page refreshes.
                 */
                this.USER_PLANNER.token = resp.token;
                localStorage.setItem('currentUser', JSON.stringify(this.USER_PLANNER));
                this.authenticationService.setUser(this.USER_PLANNER);

                return this.USER_PLANNER;
              } else {
                return of(null);
              }
            }));
        } else {
          /*
           * Store user details in local storage to keep user logged in between page refreshes.
           */
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.authenticationService.setUser(user);

          return of(user);
        }
      }), catchError((error: HttpErrorResponse) => {
        return of(null);
      }));
  }

  public getMockMainGridData(): Observable<PlannedPart[]> {
    const httpOptions: any = {
      headers: new HttpHeaders({
        Authorization: 'none'
      })
    };

    // Explicity set 'none' Authorization header so it is stripped for this request
    return this.http.get<PlannedPart[]>(environment.apiMainGridData, {
      headers: new HttpHeaders({
        Authorization: 'none'
      })
    }).pipe(
      map((resp: PlannedPart[]) => {
        return resp.map((data: PlannedPart) => new PlannedPart(data));
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError('Could not retrieve main grid data.');
      })
    );
  }

  public getMockNoteData(): Observable<PartNote[]> {
    return this.http.get<PartNote[]>(environment.apiMockNotes)
      .pipe(
        map((resp: PartNote[]) => {
          return resp.map((data: PartNote) => new PartNote(data));
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError('Could not retrieve mock note data.');
        })
      );
  }

  public postNoteData(newTitle: string, newDescription: string): Observable<PartNote> {
    const body: object = {
      title: newTitle,
      description: newDescription
    };

    return this.http.post<PartNote>(environment.apiPostNote, body)
      .pipe(
        map((createdNote: PartNote) => {
          return createdNote;
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError('Could not post new note.');
        })
      );
  }
}
