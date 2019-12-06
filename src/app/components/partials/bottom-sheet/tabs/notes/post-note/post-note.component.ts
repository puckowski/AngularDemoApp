import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataHelper } from '@app/helpers/data-helper.helper';
import { RequestService } from '@app/services/requests/request.service';
import { PartNote } from '@app/models/part-note.model';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-post-note',
  templateUrl: './post-note.component.html',
  styleUrls: ['./post-note.component.scss']
})
export class PostNoteComponent implements OnInit, OnDestroy {

  private readonly NOTE_MAX_LENGTH_CHARS = 250;

  @Input()
  private requestSubject: BehaviorSubject<boolean>;
  private errorMessage: string;

  public noteFormControl: FormControl;
  public plannerName: string;

  constructor(private requestService: RequestService) {
    this.noteFormControl = new FormControl('', [
      // tslint:disable-next-line: no-unbound-method
      Validators.required,
      Validators.maxLength(this.NOTE_MAX_LENGTH_CHARS)
    ]);
  }

  public ngOnInit(): void {
    return;
  }

  public ngOnDestroy(): void {
    return;
  }

  public getMaxCommentLength(): number {
    return this.NOTE_MAX_LENGTH_CHARS;
  }

  public hasErrorMessage(): boolean {
    return DataHelper.isDefined(this.errorMessage);
  }

  public getErrorMessage(): string {
    return this.errorMessage;
  }

  public performPostNoteAction(): void {
    if (DataHelper.isDefined(this.plannerName) === false) {
      this.errorMessage = 'Planner name required.';

      return;
    }

    if (DataHelper.isDefined(this.noteFormControl.value) === false) {
      this.errorMessage = 'Note required.';

      return;
    }

    if (this.noteFormControl.valid === true) {
      this.requestService.postNoteData(this.plannerName, this.noteFormControl.value).subscribe((createdNote: PartNote) => {
        this.errorMessage = null;
        this.plannerName = '';
        this.noteFormControl.setValue('');

        this.requestSubject.next(true);
      }, (error: HttpErrorResponse) => {
        this.errorMessage = 'Failed to add new note. Please try again later.';
      });
    }
  }
}
