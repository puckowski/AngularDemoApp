import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@models/user.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

    constructor(private http: HttpClient) {

    }

    public getAll(): Observable<Array<User>> {
        return this.http.get<Array<User>>(environment.apiUserList);
    }
}
