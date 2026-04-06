import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { TableModel } from './table-model';
import { ColumnDefHeaders } from './column-def-headers/column-def-headers';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ColumnDefBody } from './column-def-body/column-def-body';
import { SearchableDisplayState } from './searchable-display-state';
import { ColumnDefFooter } from './column-def-footer/column-def-footer';
import { debounceTime, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Pagination } from "./pagination/pagination";

@Component({
  selector: 'sd-searchable-display',
  imports: [ReactiveFormsModule, ColumnDefHeaders, ColumnDefBody, ColumnDefFooter, Pagination],
  template: `
    <form [formGroup]="displayForm">
      @if (title()) {
        <header>{{ title() }}</header>
      }
      @if (tableModel().globalSearchable) {
        <input type="search" placeholder="Search all columns..." formControlName="globalSearch" />
      }
      @if (visibilityGroupOptions().length > 0) {
        <select formControlName="visibilityGroup">
          @for (group of visibilityGroupOptions(); track group.display) {
            <option value="{{ group.value }}">
              {{ group.display }}
            </option>
          }
        </select>
      }
      <table [classList]="tableStyleClasses()">
        <thead sd-column-def-headers></thead>
        <tbody sd-column-def-body></tbody>
        <tfoot sd-column-def-footer></tfoot>
      </table>
      @if (tableModel().pagination) {
        <sd-pagination></sd-pagination>
      }
    </form>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchableDisplay {
  tableModel = input.required<TableModel>();
  title = input<string>();
  tableStyleClasses = input<string[]>();

  protected readonly tableStateService = inject(SearchableDisplayState);

  protected readonly displayForm = inject(FormBuilder).group({
    globalSearch: [''],
    visibilityGroup: [
      this.tableStateService.tableModel()?.dataColumnVisibility
        ?.defaultVisibilityGroup ?? 'all',
    ],
  });

  protected readonly globalSearchValue = toSignal(
    this.displayForm.controls.globalSearch.valueChanges.pipe(
      debounceTime(300),
      switchMap((value) => {
        return [value];
      }),
    ),
    { initialValue: '' },
  );

  protected readonly visibilityGroupOptions = computed(() => {
    let specifiedGroups: { display: string; value: string }[] = [];
    let tableModel = this.tableModel();
    if (tableModel.dataColumnVisibility) {
      if (tableModel.dataColumnVisibility!.allowShowAll) {
        specifiedGroups.push({ display: 'Show All', value: 'all' });
      }
      if (tableModel.dataColumnVisibility!.allowHideAll) {
        specifiedGroups.push({ display: 'Hide All', value: 'none' });
      }
      for (let group of Object.entries(
        tableModel.dataColumnVisibility!.visibilityGroups ?? {},
      )) {
        specifiedGroups.push({ display: group[0], value: group[0] });
      }
    }
    return specifiedGroups;
  });

  protected readonly currentVisibilitySet = toSignal(this.displayForm.controls.visibilityGroup.valueChanges);

  constructor() {
    effect(() => this.tableStateService.initializeTableState(this.tableModel()));
    effect(() => {
      let currentGlobalSearchValue = this.globalSearchValue() ?? '';
      this.tableStateService.globalQuery(currentGlobalSearchValue);
    });
    effect(() => {
      let currentVisibilityGroup = this.currentVisibilitySet();
      if (currentVisibilityGroup) {
        this.tableStateService.setVisibilityGroup(currentVisibilityGroup);
      }
    });
  }
}
