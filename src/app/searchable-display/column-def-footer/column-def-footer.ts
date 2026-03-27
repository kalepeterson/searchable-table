import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { SearchableDisplayState } from '../searchable-display-state';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ColumnSearchTerm } from '../table-model';

@Component({
  selector: 'tfoot[sd-column-def-footer]',
  imports: [ReactiveFormsModule],
  template: `
		@let tstate = this.tableStateService.tableState();
		@if (tstate) {
      <tr>
        @for (columnDef of tstate.visibleColumns; track columnDef) {
          <td>
            @if (columnDef.searchable) {
              <input type="search" placeholder="Search column..." [formControl]="columnSearchControls()[columnDef.header]" />
            }
          </td>
        }
      </tr>
    }
	`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnDefFooter {
  protected readonly tableStateService = inject(SearchableDisplayState);

  protected readonly columnSearchControls = computed(() => {
    const controls: { [key: string]: FormControl<string | null> } = {};
    const tstate = this.tableStateService.tableState();
    if (tstate) {
      for (const columnDef of tstate.visibleColumns) {
        if (columnDef.searchable) {
          controls[columnDef.header] = new FormControl<string | null>('');
        }
      }
    }
    return controls;
  });

  protected readonly columnSearchChange = toSignal(combineLatest(Object.entries(this.columnSearchControls())
      .map(controlMapping => {
        const [header, control] = controlMapping;
        return control.valueChanges.pipe(
          debounceTime(300),
          map(value => {
            return {
              header: header,
              searchTerm: value ?? '',
            } as unknown as ColumnSearchTerm;
          })
        );
    })
  ));  

  constructor() {
    // Subscribe to changes in column search controls and update the table state accordingly
    effect(() => {
      const tstate = this.tableStateService.tableState();
      const columnSearchChanges = this.columnSearchChange();
      if (tstate && columnSearchChanges) {
          this.tableStateService.performColumnQueries(columnSearchChanges);
      }
    });
  }
}
