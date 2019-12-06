import { Component, OnInit, OnDestroy } from '@angular/core';
import { BottomSheetService } from '@app/services/bottom-sheet.service';
import { SubscriberGeneric } from '@app/helpers/subscriber-generic.helper';
import { PlannedPart } from '@app/models/planned-part.model';

@Component({
  selector: 'app-part-info',
  templateUrl: './part-info.component.html',
  styleUrls: ['./part-info.component.scss']
})
export class PartInfoComponent extends SubscriberGeneric implements OnInit, OnDestroy {

  private selectedPart: PlannedPart;

  constructor(private sheetService: BottomSheetService) {
    super();
   }

  public ngOnInit(): void {
    this.pushAutoUnsubscribeArray([
      this.sheetService.getRowNodeSubject().subscribe((newPlannedPart: PlannedPart) => {
        this.selectedPart = newPlannedPart;
      })
    ]);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public hasSelectedPart(): boolean {
    return this.selectedPart !== null && this.selectedPart !== undefined;
  }

  public getSelectedPart(): PlannedPart {
    return this.selectedPart;
  }
}
