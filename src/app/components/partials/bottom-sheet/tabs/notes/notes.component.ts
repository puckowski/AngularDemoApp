import { Component, OnInit, OnDestroy } from '@angular/core';
import { BottomSheetService } from '@app/services/bottom-sheet.service';
import { PlannedPart } from '@app/models/planned-part.model';
import { SubscriberGeneric } from '@app/helpers/subscriber-generic.helper';
import { PartNote } from '@app/models/part-note.model';
import { RequestService } from '@app/services/requests/request.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataHelper } from '@app/helpers/data-helper.helper';
import { AuthenticationService } from '@app/services/authentication.service';
import { AuthorizationLevel } from '@app/models/user.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent extends SubscriberGeneric implements OnInit, OnDestroy {

  private ERROR_NONE = 0;
  private ERROR_FAILED_NOTE_REQUEST = 100;

  private requestSubject: BehaviorSubject<boolean>;
  private selectedPart: PlannedPart;
  private partNotes: Array<PartNote>;
  private errorState: number;
  private requestCount: number;
  private isPlanner: boolean;

  constructor(private sheetService: BottomSheetService, private requestService: RequestService,
              private authenticationService: AuthenticationService) {
    super();

    this.requestSubject = new BehaviorSubject<boolean>(false);
    this.errorState = this.ERROR_NONE;
    this.partNotes = new Array<PartNote>();
    this.requestCount = 0;
    this.isPlanner = this.checkIsPlanner();
   }

  public ngOnInit(): void {
    this.pushAutoUnsubscribeArray([
      this.sheetService.getRowNodeSubject().subscribe((newPlannedPart: PlannedPart) => {
        if (DataHelper.isDefined(newPlannedPart) === false) {
          return;
        }

        if (DataHelper.isDefined(this.selectedPart) === false) {
          this.selectedPart = newPlannedPart;
          this.requestNoteData(this.selectedPart);
        } else if (DataHelper.isDefined(this.selectedPart) === true
            && this.selectedPart.partNumber !== newPlannedPart.partNumber) {
          this.selectedPart = newPlannedPart;
          this.requestNoteData(this.selectedPart);
        }
      }),

      this.requestSubject.subscribe((shouldRequest: boolean) => {
        if (shouldRequest === true) {
          if (DataHelper.isDefined(this.selectedPart) === true) {
            this.requestNoteData(this.selectedPart);
          }

          this.requestSubject.next(false);
        }
      })
    ]);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private checkIsPlanner(): boolean {
    const authorizationLevel: number = this.authenticationService.currentUserValue.authorizationLevel;

    return authorizationLevel === AuthorizationLevel.AUTHORIZATION_PLANNER;
  }

  public getIsPlanner(): boolean {
    return this.isPlanner;
  }

  public hasError(): boolean {
    return this.errorState === this.ERROR_FAILED_NOTE_REQUEST;
  }

  public hasSelectedPart(): boolean {
    return DataHelper.isDefined(this.selectedPart);
  }

  public getNotes(): Array<PartNote> {
    return this.partNotes;
  }

  public hasNotes(): boolean {
    return this.partNotes.length > 0
      && this.errorState === this.ERROR_NONE;
  }

  public displayLoadingText(): boolean {
    return this.requestCount === 0
      && this.errorState === this.ERROR_NONE;
  }

  public displayNotePlaceholder(): boolean {
    if (this.errorState !== this.ERROR_NONE) {
      // If we got an error, do not display placeholder.
      return false;
    }

    const hasRequested: boolean = this.requestCount > 0;
    const hasNoNotes: boolean = this.partNotes.length === 0;

    return hasRequested && hasNoNotes;
  }

  public getRequestSubject(): BehaviorSubject<boolean> {
    return this.requestSubject;
  }

  private requestNoteData(plannedPart: PlannedPart): void {
    this.requestService.getMockNoteData().subscribe((partNotes: PartNote[]) => {
      this.partNotes = partNotes;
      this.errorState = this.ERROR_NONE;
      this.requestCount++;
    }, (error: HttpErrorResponse) => {
      this.partNotes = new Array<PartNote>();
      this.errorState = this.ERROR_FAILED_NOTE_REQUEST;
    });
  }

}
