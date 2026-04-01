import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SearchableDisplayState } from '../searchable-display-state';
import { ColumnDefinition } from '../table-model';

@Component({
	selector: 'thead[sd-column-def-headers]',
	imports: [],
	template: `
		@let tstate = tableState();
		@if (tstate) {
			@for (columnDef of tstate.visibleColumns; track columnDef) {
				<th (click)="sortColumn(columnDef)">{{ columnDef.header }} <span class="sort-indicator">{{ columnSortDisplays().find(csd => csd.header === columnDef.header)?.display }}</span></th>
			}
		}
	`,
	styles: `
		.sort-indicator {
			font-size: 0.8em;
			margin-left: 4px;
		}
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnDefHeaders {
	tableStateService = inject(SearchableDisplayState);
	tableState = this.tableStateService.tableState;

	protected readonly columnSortDisplays = computed(() => {
		const tstate = this.tableState();
		if (!tstate) {
			return [];
		}
		return tstate.visibleColumns.map(col => {
			let displayValue = '';
			if (tstate.sortColumn === col.header) {
				displayValue += (tstate.sortDirection === 'asc' ? '^' : 'v');
			} else if (col.sortable) {
				displayValue += '↕';
			}
			return {
				header: col.header,
				display: displayValue,
			};
		});
	});

	sortColumn(columnDef: ColumnDefinition): void {
		this.tableStateService.sortColumn(columnDef);
	}
}
