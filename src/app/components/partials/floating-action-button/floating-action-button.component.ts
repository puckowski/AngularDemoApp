import { Component, OnInit } from '@angular/core';
import { speedDialFabAnimations } from './floating-action-button.animations';
import { GridService } from '@app/services/grid.service';

@Component({
  selector: 'app-floating-action-button',
  templateUrl: './floating-action-button.component.html',
  styleUrls: ['./floating-action-button.component.scss'],
  animations: speedDialFabAnimations
})
export class FloatingActionButtonComponent implements OnInit {

  private readonly ACTION_ID_FIT_GRID: string = 'fitGrid';
  private readonly ACTION_ID_AUTO_SIZE_GRID: string = 'autoSizeGrid';

  private readonly FAB_TOGGLER_STATE_ACTIVE: string = 'active';
  private readonly FAB_TOGGLER_STATE_INACTIVE: string = 'inactive';

  private buttons: Array<any>;
  private fabTogglerState: string;

  private fabButtons: Array<any> = [
    {
      icon: 'compare_arrows',
      label: 'Fit Main Grid',
      actionId: this.ACTION_ID_FIT_GRID
    },
    {
      icon: 'zoom_out_map',
      label: 'Auto Size Main Grid',
      actionId: this.ACTION_ID_AUTO_SIZE_GRID
    }
  ];

  constructor(private gridService: GridService) {
    this.buttons = new Array<any>();
    this.fabTogglerState = this.FAB_TOGGLER_STATE_INACTIVE;
  }

  public ngOnInit(): void {
    return;
  }

  public getButtons(): Array<any> {
    return this.buttons;
  }

  public getFabTogglerState(): string {
    return this.fabTogglerState;
  }

  public showItems() {
    this.fabTogglerState = this.FAB_TOGGLER_STATE_ACTIVE;
    this.buttons = this.fabButtons;
  }

  public hideItems() {
    this.fabTogglerState = this.FAB_TOGGLER_STATE_INACTIVE;
    this.buttons = [];
  }

  public onToggleFab() {
    const visibleButtonCount: number = this.buttons.length;
    const buttonsVisible: boolean = visibleButtonCount !== 0;
    buttonsVisible ? this.hideItems() : this.showItems();
  }

  private performFitAction(): void {
    this.gridService.columnFitAll(this.gridService.getMainGridKey());
  }

  private performAutoSizeAction(): void {
    this.gridService.columnAutoSizeAll(this.gridService.getMainGridKey());
  }

  public performAction(actionId: string): void {
    switch (actionId) {
      case this.ACTION_ID_FIT_GRID: {
        this.performFitAction();

        break;
      }
      case this.ACTION_ID_AUTO_SIZE_GRID: {
        this.performAutoSizeAction();

        break;
      }
      default: {

        break;
      }
    }

    this.onToggleFab();
  }
}
