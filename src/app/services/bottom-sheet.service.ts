import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';
import { RoutingService } from './routing.service';
import { PlannedPart } from '@app/models/planned-part.model';

@Injectable({
  providedIn: 'root'
})
export class BottomSheetService {

  public readonly BOTTOM_SHEET_STATE_CLOSED: number = 100;
  public readonly BOTTOM_SHEET_STATE_OPEN: number = 200;
  public readonly BOTTOM_SHEET_STATE_DEFAULT: number = this.BOTTOM_SHEET_STATE_CLOSED;

  private readonly VALID_BOTTOM_SHEET_STATES: Set<number> = new Set([
    this.BOTTOM_SHEET_STATE_CLOSED,
    this.BOTTOM_SHEET_STATE_OPEN]
  );

  private readonly ROW_NODE_DEFAULT: PlannedPart = null;

  private bottomSheetState: BehaviorSubject<number>;
  private selectedRowNodeSubject: BehaviorSubject<PlannedPart>;

  constructor(private loggerService: LoggerService, private routingService: RoutingService) {
    this.bottomSheetState = new BehaviorSubject<number>(this.BOTTOM_SHEET_STATE_DEFAULT);
    this.selectedRowNodeSubject = new BehaviorSubject<PlannedPart>(this.ROW_NODE_DEFAULT);
  }

  public getBottomSheetSubject(): BehaviorSubject<number> {
    return this.bottomSheetState;
  }

  public getBottomSheetState(): number {
    return this.bottomSheetState.value;
  }

  public isBottomSheetOpen(): boolean {
    return this.getBottomSheetState() === this.BOTTOM_SHEET_STATE_OPEN;
  }

  public setBottomSheetState(newSheetState: number): void {
    if (this.VALID_BOTTOM_SHEET_STATES.has(newSheetState) === true) {
      this.bottomSheetState.next(newSheetState);
    } else {
      this.loggerService.error('Invalid bottom sheet state assignment. Attempted state: ' + newSheetState);
    }
  }

  public closeBottomSheet(): void {
    this.clearSelectedRowNode();
    this.routingService.navigateRoot();
    this.bottomSheetState.next(this.BOTTOM_SHEET_STATE_CLOSED);
  }

  public openBottomSheet(): void {
    this.bottomSheetState.next(this.BOTTOM_SHEET_STATE_OPEN);
  }

  public toggleBottomSheet(): void {
    if (this.isBottomSheetOpen() === true) {
      this.closeBottomSheet();
    } else {
      this.openBottomSheet();
    }
  }

  public setSelectedRowNode(plannedPart: PlannedPart): void {
    this.selectedRowNodeSubject.next(plannedPart);

    if (this.isBottomSheetOpen() === false) {
      this.openBottomSheet();
    }
  }

  public clearSelectedRowNode(): void {
    this.selectedRowNodeSubject.next(this.ROW_NODE_DEFAULT);
  }

  public getRowNodeSubject(): BehaviorSubject<PlannedPart> {
    return this.selectedRowNodeSubject;
  }
}
