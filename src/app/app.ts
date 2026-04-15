import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
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
    <fieldset>
      <legend>Table Actions</legend>
      <button (click)="refreshData()">Refresh Data</button>
      <button (click)="addUser()">Generate Random User</button>
    </fieldset>
    <sd-searchable-display title="Users" [dataRows]="userData()" [tableModel]="userTableModel()"></sd-searchable-display>
    <router-outlet />
  `,
  styles: ``,
})
export class App {
  protected readonly title = signal('Searchable Table');
  protected readonly usersService = inject(UserPlaceholderService);

  protected readonly updateTrigger = signal(0);

  protected readonly refreshData = () => {
    this.updateTrigger.set(this.updateTrigger() + 1);
  }

  protected readonly users = computed(() => {
    const trigger = this.updateTrigger(); // Value doesn't matter, just used to trigger recomputation when refreshData is called
    return [...this.usersService.users()];
  });

  protected readonly userData = linkedSignal(() => {
    return [...this.users()];
  });

  addUser() {
    const users = this.userData();
    let randomNewUser: UserData = this.usersService.generateRandomUser();
    this.userData.set([...users, randomNewUser]);
  }

  removeUser(userId: number) {
    const users = this.userData();
    this.userData.set(users.filter(u => u.id !== userId));
  }

  protected readonly userTableModel = computed(() => {
    var tableModel = new TableModel<UserData>();
    return {
      ...tableModel,
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
                if (confirm(`Are you sure you want to delete user "${row.name}"?`)) {
                  this.removeUser(row.id);
                }
                return signal(null);
              },
            },
          ],
        },
      ],
      pagination: {
        pageSizeOptions: [3, 5, 10, 13],
        pageButtons: ['all'],
      },
    } as TableModel<UserData>;
  });
}
