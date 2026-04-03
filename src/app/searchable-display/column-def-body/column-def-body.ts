import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchableDisplayState } from '../searchable-display-state';

@Component({
	selector: 'tbody[sd-column-def-body]',
	imports: [],
	template: `
		@let tstate = tableState();
		@if (tstate) {
			@for (row of tstate.displayedData; track row.id) {
				<tr>
				@for (columnDef of tstate.visibleColumns; track columnDef) {
					<td>{{ columnDef.valueDisplayMapper(row) }}</td>
				}
				</tr>
			}
		}
	`,
	styles: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnDefBody {
	protected readonly tableState = inject(SearchableDisplayState).tableState;
}
