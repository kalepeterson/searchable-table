import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchableDisplay } from './searchable-display/searchable-display';
import { UserPlaceholderService } from './services/user-placeholder';
import { TableModel } from './searchable-display/table-model';
import { USER_COLUMN_DEFS } from './models/user-column-defs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SearchableDisplay],
  template: `
    <h1>Searchable Table Demo</h1>
    <sd-searchable-display title="Users" [tableModel]="userTableModel()"></sd-searchable-display>
    <router-outlet />
  `,
  styles: ``,
})
export class App {
  protected readonly title = signal('Searchable Table');
  protected readonly users = inject(UserPlaceholderService).users;

  protected readonly userTableModel = computed(() => {
    return {
      data: this.users(),
      dataColumns: USER_COLUMN_DEFS,
      globalSearchable: true
    } as TableModel;
  });
}