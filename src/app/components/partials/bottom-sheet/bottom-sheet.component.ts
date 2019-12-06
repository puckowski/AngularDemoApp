import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { BottomSheetService } from '@app/services/bottom-sheet.service';
import { RoutingService } from '@app/services/routing.service';
import { PlannedPart } from '@app/models/planned-part.model';
import { Location } from '@angular/common';
import { DataHelper } from '@app/helpers/data-helper.helper';
import { MatTabNav } from '@angular/material';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.scss']
})
export class BottomSheetComponent implements OnInit {

  private readonly BROWSER_WINDOW_FINISH_RESIZE_MILLIS: number = 250;

  @ViewChild(MatTabNav, { static: false })
  private matTabGroup: MatTabNav;

  private isOpen: boolean;
  private isMinimized: boolean;
  private navLinks: Array<any>;
  private selectedPlannedPart: PlannedPart;
  private resizeRequestCount: number;

  constructor(private bottomSheetService: BottomSheetService, private routingService: RoutingService, private location: Location) {
    this.isOpen = false;
    this.isMinimized = false;
    this.resizeRequestCount = 0;

    this.bottomSheetService.getBottomSheetSubject().subscribe((newBottomSheetState: number) => {
      if (newBottomSheetState === this.bottomSheetService.BOTTOM_SHEET_STATE_OPEN) {
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    });

    this.bottomSheetService.getRowNodeSubject().subscribe((newPlannedPart: PlannedPart) => {
      this.selectedPlannedPart = newPlannedPart;
      this.updateRouteForNewPart(newPlannedPart);
    });

    this.navLinks = [
      {
        label: 'Part Info',
        link: '/partinfo'
      }, {
        label: 'Forecast Supply',
        link: '/forecastsupply'
      }, {
        label: 'MRP Data',
        link: '/mrpdata'
      }, {
        label: 'Part Notes',
        link: '/notes'
      },
    ];
  }

  public ngOnInit(): void {
    return;
  }

  // FIXME delete when https://github.com/angular/material2/issues/6130 is fixed
  private updatePagination() {
    // tslint:disable-next-line: ban
    setTimeout(() => {
      this.matTabGroup.updatePagination();
    }, this.BROWSER_WINDOW_FINISH_RESIZE_MILLIS);
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: any): void {
    const WINDOW_WIDTH_NEEDS_PAGINATION_PIXELS = 870;

    if (event.target.innerWidth <= WINDOW_WIDTH_NEEDS_PAGINATION_PIXELS) {
      this.updatePagination();
    }

    /*
     * Workaround for angular plotly which only triggers resizing on window resize event.
     */
    if (this.resizeRequestCount === 0) {
      // tslint:disable-next-line: ban
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, this.BROWSER_WINDOW_FINISH_RESIZE_MILLIS);
      this.resizeRequestCount++;
    } else {
      this.resizeRequestCount--;
    }
  }

  public getNavLinks(): any[] {
    return this.navLinks;
  }

  public getIsOpen(): boolean {
    return this.isOpen;
  }

  public getIsMinimized(): boolean {
    return this.isMinimized;
  }

  public hasSelectedPart(): boolean {
    return this.selectedPlannedPart !== null && this.selectedPlannedPart !== undefined;
  }

  public getSelectedPart(): PlannedPart {
    return this.selectedPlannedPart;
  }

  private updateRouteForNewPart(newPlannedPart: PlannedPart): void {
    // TODO
    const currentPathWithoutHash: string = this.location.path(false);
    const currentUrlSegmentStrings: string[] = currentPathWithoutHash.split('/');
    currentUrlSegmentStrings.splice(0, 1);

    if (DataHelper.isDefined(newPlannedPart) === true) {
      if (currentUrlSegmentStrings.length > 0) {
        const encodedPartNumber: string = encodeURIComponent(this.bottomSheetService.getRowNodeSubject().value.partNumber);
        this.routingService.navigateAbsolute([ currentUrlSegmentStrings[0] + '/',
          encodedPartNumber ]);
      } else {
        const encodedPartNumber: string = encodeURIComponent(newPlannedPart.partNumber);
        this.routingService.navigateRelative([ encodedPartNumber ]);
      }
    }
  }

  public updateRouteForExistingPart(link): void {
    const encodedPartNumber: string = encodeURIComponent(this.bottomSheetService.getRowNodeSubject().value.partNumber);
    this.routingService.navigateAbsolute([ link + '/', encodedPartNumber ]);
  }

  public closeBottomSheet(): void {
    this.bottomSheetService.closeBottomSheet();
  }

  public toggleMinimizeBottomSheet(): void {
    this.isMinimized = !this.isMinimized;
  }
}
