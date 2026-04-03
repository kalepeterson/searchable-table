import { Injectable, signal } from '@angular/core';
import { ColumnDefinition, ColumnSearchTerm, TableModel, TableState } from './table-model';

@Injectable({
	providedIn: 'root',
})
export class SearchableDisplayState {
	tableState = signal<TableState | undefined>(undefined);

	initializeTableState(tableModel: TableModel): void {
		let nextState: TableState = {
			tableModel,
			displayedData: tableModel.data,
			visibleColumns: [],
			currentPage: tableModel.pagination ? 1 : undefined,
			pageSize: tableModel.pagination ? tableModel.pagination.pageSizeOptions?.[0] : undefined,
		};
		const visibleColumns = this.determineVisibleColumns(nextState);
		nextState.visibleColumns = visibleColumns;
		this.tableState.set(nextState);
	}

	globalQuery(query: string | null | undefined): void {
		const queryString = query ?? '';
		if (this.tableState() && this.tableState()?.globalSearchTerm !== queryString) {
			const nextState = {
				...this.tableState()!,
				globalSearchTerm: queryString,
			};
			this.runDataPipeline(nextState);
		}
	}

	performColumnQueries(columnSearches: ColumnSearchTerm[]): void {
		const tableStateRef = this.tableState();
		if (tableStateRef) {
			const nextState = {
				...tableStateRef,
				columnSearchTerms: columnSearches,
			};
			this.runDataPipeline(nextState);
		}
	}

	setVisibilityGroup(groupName: string): void {
		var currentState = this.tableState();
		if (currentState && currentState.visibilityGroup !== groupName) {
			const nextState = {
				...currentState,
				visibilityGroup: groupName,
			};
			this.runDataPipeline(nextState);
		}
	}

	sortColumn(columnDef: ColumnDefinition): void {
		const tstate = this.tableState();
		if (tstate && columnDef.sortable) {
			let nextSortDirection: 'asc' | 'desc' = 'asc';
			if (tstate.sortColumn === columnDef.header) {
				nextSortDirection = tstate.sortDirection === 'asc' ? 'desc' : 'asc';
			}
			
			const nextState = {
				...tstate,
				sortColumn: columnDef.header,
				sortDirection: nextSortDirection
			};
			this.runDataPipeline(nextState);
		}
	}

	private runDataPipeline(updatedState: TableState): void {
		let currentState = this.tableState();
		if (!currentState) {
			return;
		}

		const visibleColumns = this.determineVisibleColumns(updatedState);
		let filteredData = [...currentState.tableModel.data];

		let globalSearchValue = updatedState.globalSearchTerm ?? currentState.globalSearchTerm ?? '';
		if (globalSearchValue) {
			filteredData = this.queryDisplayedColumns(
				filteredData,
				visibleColumns,
				globalSearchValue,
			);
		}

		let columnSearchTermsObj = updatedState.columnSearchTerms ?? currentState.columnSearchTerms;
		if (columnSearchTermsObj) {
			for (let columnSearchTerm of columnSearchTermsObj) {
				let columnDef = visibleColumns.find(
					(col) => col.header === columnSearchTerm.columnHeader,
				);
				if (columnDef && columnSearchTerm.searchTerm) {
					filteredData = this.queryIndividualColumn(
						filteredData,
						columnDef,
						columnSearchTerm.searchTerm,
					);
				}
			}
		}

		const sortColumn = updatedState.sortColumn ?? currentState.sortColumn;
		const sortDirection = updatedState.sortDirection ?? currentState.sortDirection;
		const sortColumnDef = visibleColumns.find(col => col.header === sortColumn);
		if (sortColumnDef && sortDirection) {
			filteredData.sort((a, b) => {
				const aValue = sortColumnDef.valueDisplayMapper(a);
				const bValue = sortColumnDef.valueDisplayMapper(b);
				const comparison = aValue.localeCompare(bValue);
				return sortDirection === 'asc' ? comparison : comparison * -1;
			});
		}

		this.tableState.set({
			...currentState,
			visibilityGroup: updatedState.visibilityGroup,
			visibleColumns,
			displayedData: filteredData,
			globalSearchTerm: globalSearchValue,
			columnSearchTerms: columnSearchTermsObj,
			sortColumn,
			sortDirection,
		});
	}

	private queryDisplayedColumns(data: any[], columns: ColumnDefinition[], query: string): any[] {
		return data.filter((row) => {
			for (let visibleColDef of columns) {
				if (this.matchCell(row, visibleColDef, query)) {
					return true;
				}
			}
			return false;
		});
	}

	private queryIndividualColumn(data: any[], column: ColumnDefinition, query: string): any[] {
		return data.filter((row) => {
			return this.matchCell(row, column, query);
		});
	}

	private matchCell(row: any, column: ColumnDefinition, query: string): boolean {
		let cellValue = column.valueDisplayMapper(row);
		return cellValue.toLocaleLowerCase().includes(query.toLocaleLowerCase());
	}

	private tableStateAltered(currentState: TableState, newDisplayedData: any[]): boolean {
		if (!currentState || !currentState.displayedData) {
			return true;
		}
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

	private determineVisibleColumns(tableState: TableState): ColumnDefinition[] {
		if (!tableState) {
			return [];
		}
		const visibilityGroup =
			tableState.visibilityGroup ??
			(tableState.tableModel.dataColumnVisibility?.defaultVisibilityGroup || 'all');
		if (!tableState.tableModel.dataColumnVisibility || visibilityGroup === 'all') {
			return tableState.tableModel.dataColumns || [];
		}
		if (visibilityGroup === 'none') {
			return (
				tableState.tableModel.dataColumnVisibility!.baseColumns ??
				tableState.tableModel.dataColumns ??
				[]
			);
		}

		const { baseColumns, visibilityGroups } = tableState.tableModel.dataColumnVisibility ?? {};
		if (visibilityGroups && visibilityGroups[visibilityGroup]) {
			return [...baseColumns, ...visibilityGroups[visibilityGroup]];
		}
		return baseColumns;
	}
}
