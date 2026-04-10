import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SearchableDisplayState } from '../searchable-display-state';

@Component({
	selector: 'tbody[sd-column-def-body]',
	imports: [],
	template: `
		@let tableState = this.tableState();
		@let tableModel = this.tableModel();
		@if (tableState && tableModel) {
			@for (row of tableState.displayedData; track row.id) {
				<tr>
					@for (actionColumn of startActions(); track actionColumn) {
						<td>
							@for (actionButton of actionColumn.actionButtonDefinitions; track actionButton) {
								<a href="#" role="button" (click)="actionButton.clickAction(row)()">{{ actionButton.buttonText }}</a>
							}
						</td>
					}
				@for (columnDef of tableState.visibleColumns; track columnDef) {
					<td>{{ columnDef.valueDisplayMapper(row) }}</td>
				}
				@for (actionColumn of endActions(); track actionColumn) {
					<td>
						@for (actionButton of actionColumn.actionButtonDefinitions; track actionButton) {
							<a href="#" role="button" (click)="actionButton.clickAction(row)()">{{ actionButton.buttonText }}</a>
						}
					</td>
				}
				</tr>
			}
		}
	`,
	styles: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnDefBody {
	protected readonly tableStateService = inject(SearchableDisplayState);
	protected readonly tableState = this.tableStateService.tableState;
	protected readonly tableModel = this.tableStateService.tableModel;
	protected readonly startActions = computed(() => this.tableModel()?.actionColumns?.filter(ac => ac.columnLocation === 'start') ?? []);
	protected readonly endActions = computed(() => this.tableModel()?.actionColumns?.filter(ac => ac.columnLocation === 'end') ?? []);
}
