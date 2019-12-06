import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { PlannedPart } from '@app/models/planned-part.model';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { LoggerService } from '../logger.service';
import { environment } from '@environments/environment';
import { PartNote } from '@app/models/part-note.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private loggerService: LoggerService) { }

  public getMockMainGridData(): Observable<PlannedPart[]> {
    return this.http.get<PlannedPart[]>(environment.apiMainGridData)
      .pipe(
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
