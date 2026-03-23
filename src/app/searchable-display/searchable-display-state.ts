import { Injectable, signal } from '@angular/core';
import { ColumnDefinition, TableModel, TableState } from './table-model';

@Injectable({
	providedIn: 'root',
})
export class SearchableDisplayState {
	tableState = signal<TableState | undefined>(undefined);

	initializeTableState(tableModel: TableModel): void {
		const nextState: TableState = {
			tableModel,
			displayedData: tableModel.data,
			visibleColumns: this.determineVisibleColumns(tableModel),
			currentPage: tableModel.pagination ? 1 : undefined,
			pageSize: tableModel.pagination ? tableModel.pagination.pageSizeOptions?.[0] : undefined,
		};
		this.tableState.set(nextState);
	}

	globalQuery(query: string | null | undefined): void {
		const queryString = query ?? '';
		if (this.tableState()) {
			let filteredData = this.queryDisplayedColumns(this.tableState()!.tableModel.data, this.tableState()!.visibleColumns, queryString);
			if (this.tableStateAltered(this.tableState()!, filteredData)) {
				this.tableState.update((prevState: TableState | undefined) => {
					return {
						...prevState,
						displayedData: filteredData,
					} as TableState;
				});
			}
		}
	}

	private queryDisplayedColumns(data: any[], columns: ColumnDefinition[], query: string): any[] {
		return data.filter(row => {
			for (let visibleColDef of columns) {
				let cellValue = visibleColDef.valueDisplayMapper(row);
				if (cellValue && cellValue.toLocaleLowerCase().includes(query.toLocaleLowerCase())) {
					return true;
				}
			}
			return false;
		});
	}

	private tableStateAltered(currentState: TableState, newDisplayedData: any[]): boolean {
		if (currentState.displayedData.length !== newDisplayedData.length) {
			return true;
		}
		for (let i = 0; i < currentState.displayedData.length; i++) {
			if (currentState.displayedData[i] !== newDisplayedData[i]) {
				return true;
			}
		}
		return false;
	}

	private determineVisibleColumns(tableModel: TableModel): ColumnDefinition[] {
		const visibilityGroup = tableModel.dataColumnVisibility?.defaultVisibilityGroup || 'all';
		if (!tableModel.dataColumnVisibility || visibilityGroup === 'all') {
			return tableModel.dataColumns;
		}
		if (visibilityGroup === 'none') {
			return tableModel.dataColumnVisibility.baseColumns;
		}

		const { baseColumns, visibilityGroups } = tableModel.dataColumnVisibility;
		if (visibilityGroups && visibilityGroups[visibilityGroup]) {
			return [...baseColumns, ...visibilityGroups[visibilityGroup]];
		}
		return baseColumns;
	}
}
