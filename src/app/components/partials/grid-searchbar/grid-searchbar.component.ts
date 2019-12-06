import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-grid-searchbar',
  templateUrl: './grid-searchbar.component.html',
  styleUrls: ['./grid-searchbar.component.scss']
})
export class GridSearchbarComponent implements OnInit {

  private readonly DEFAULT_SEARCH_DEBOUNCE_MILLIS: number = 100;

  @Output()
  private valueChange: EventEmitter<string>;

  private searchControl: FormControl;

  constructor() {
    this.searchControl = new FormControl('');
    this.valueChange = new EventEmitter<string>();
  }

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(this.DEFAULT_SEARCH_DEBOUNCE_MILLIS), distinctUntilChanged())
      .subscribe((newSearchFilter: string) => {
        this.valueChange.emit(newSearchFilter);
      });
  }

  public hasQuickFilter(): boolean {
    return this.searchControl.value !== null
      && this.searchControl.value !== undefined
      && this.searchControl.value !== '';
  }

  public resetQuickFilter(): void {
    this.searchControl.setValue('');
  }

  public getSearchControl(): FormControl {
    return this.searchControl;
  }
}
