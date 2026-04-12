import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchableDisplay } from './searchable-display/searchable-display';
import { UserPlaceholderService } from './services/user-placeholder';
import { TableModel } from './searchable-display/table-model';
import {
  USER_COLUMN_DEFINITIONS_OPTIONS,
  USER_COLUMN_DEFS_BASE,
  USER_COLUMN_DEFS_FULL,
} from './models/user-column-defs';
import { UserData } from './models/user';

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
      data: [...this.users()],
      dataColumns: USER_COLUMN_DEFS_FULL,
      dataColumnVisibility: {
        allowShowAll: true,
        allowHideAll: true,
        baseColumns: USER_COLUMN_DEFS_BASE,
        visibilityGroups: USER_COLUMN_DEFINITIONS_OPTIONS,
        defaultVisibilityGroup: 'all',
      },
      globalSearchable: true,
      actionColumns: [
        {
          header: 'Actions',
          columnLocation: 'start',
          actionButtonDefinitions: [
            {
              buttonText: 'View Details',
              clickAction: (row: UserData) => {
                alert(`User details:\n${JSON.stringify(row, null, 2)}`);
                return signal(null);
              },
            },
            {
              buttonText: 'Email',
              clickAction: (row: UserData) => {
                alert(`Send an email to:\n${row.email}`);
                return signal(null);
              },
            },
          ],
        },
        {
          header: 'Delete',
          columnLocation: 'end',
          actionButtonDefinitions: [
            {
              buttonText: '🗑',
              clickAction: (row: UserData) => {
                alert(`Deleting user:\n${JSON.stringify(row, null, 2)}`);
                return signal(null);
              },
            },
          ],
        },
      ],
      pagination: {
        pageSizeOptions: [3, 4, 5, 7, 10, 13],
        pageButtons: ['all'],
      },
    } as TableModel<UserData>;
  });
}
