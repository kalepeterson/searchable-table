import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SearchableDisplayState } from '../searchable-display-state';

@Component({
  selector: 'tfoot[sd-column-def-footer]',
  imports: [],
  template: `
		@let tstate = tableState();
		@if (tstate) {
      <tr>
        @for (columnDef of tstate.visibleColumns; track columnDef) {
          <td>{{ columnDef.searchable ? '(searchable)' : '' }}</td>
        }
      </tr>
    }
	`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnDefFooter {
  protected readonly tableState = inject(SearchableDisplayState).tableState;
}
