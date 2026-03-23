import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchableDisplayState } from '../searchable-display-state';

@Component({
	selector: 'thead[sd-column-def-headers]',
	imports: [],
	template: `
		@let tstate = tableState();
		@if (tstate) {
			@for (columnDef of tstate.visibleColumns; track columnDef) {
				<th>{{ columnDef.header }}{{ columnDef.sortable ? ' (sortable)' : '' }}</th>
			}
		}
	`,
	styles: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnDefHeaders {
	tableState = inject(SearchableDisplayState).tableState;
}
