import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { TableModel } from './table-model';
import { ColumnDefHeaders } from './column-def-headers/column-def-headers';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ColumnDefBody } from './column-def-body/column-def-body';
import { SearchableDisplayState } from './searchable-display-state';
import { ColumnDefFooter } from './column-def-footer/column-def-footer';
import { debounce, debounceTime, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	selector: 'sd-searchable-display',
	imports: [ReactiveFormsModule, ColumnDefHeaders, ColumnDefBody, ColumnDefFooter],
	template: `
		<form [formGroup]="displayForm">
			@if (title()) {
				<header>{{ title() }}</header>
			}
			@if (tableModel().globalSearchable) {
				<input type="search" placeholder="Search all columns..." formControlName="globalSearch" />
			}
			<table [classList]="tableStyleClasses()">
				<thead sd-column-def-headers></thead>
				<tbody sd-column-def-body></tbody>
				<tfoot sd-column-def-footer></tfoot>
			</table>
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
	});

	protected readonly globalSearchValue = toSignal(this.displayForm.controls.globalSearch.valueChanges.pipe(debounceTime(300), switchMap(value => {
		return [value];
	})), { initialValue: '' });

	constructor() {
		effect(() => this.tableStateService.initializeTableState(this.tableModel()));
		effect(() => {
			let currentGlobalSearchValue = this.globalSearchValue() ?? '';
			this.tableStateService.globalQuery(currentGlobalSearchValue);
		});
	}
}
