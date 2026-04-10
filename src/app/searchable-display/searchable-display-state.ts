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
			this.filterDataPipeline({ globalSearchTerm: queryString });
		}
	}

	performColumnQueries(columnSearches: ColumnSearchTerm[]): void {
		const tableStateRef = this.tableState();
		if (tableStateRef) {
			this.filterDataPipeline({ columnSearchTerms: columnSearches });
		}
	}

	setVisibilityGroup(groupName: string): void {
		if (this.tableState() && this.tableState()!.visibilityGroup !== groupName) {
			const nextState = {
				...this.tableState()!,
				visibilityGroup: groupName,
			};

			const visibleColumns = this.determineVisibleColumns(nextState);
			nextState.visibleColumns = visibleColumns;

			this.tableState.set(nextState);

			this.filterDataPipeline({});
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
				sortDirection: nextSortDirection,
			};
			this.tableState.set(nextState);
		}
	}

	private filterDataPipeline({
		globalSearchTerm,
		columnSearchTerms,
	}: {
		globalSearchTerm?: string;
		columnSearchTerms?: ColumnSearchTerm[];
	}): void {
		let currentState = this.tableState();
		if (!currentState) {
			return;
		}

		let filteredData = currentState.tableModel.data;

		let globalSearchValue = globalSearchTerm ?? currentState.globalSearchTerm ?? '';
		if (globalSearchValue) {
			filteredData = this.queryDisplayedColumns(
				filteredData,
				currentState.visibleColumns,
				globalSearchValue,
			);
		}

		let columnSearchTermsObj = columnSearchTerms ?? currentState.columnSearchTerms;
		if (columnSearchTermsObj) {
			for (let columnSearchTerm of columnSearchTermsObj) {
				let columnDef = currentState.visibleColumns.find(
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

		if (this.tableStateAltered(currentState, filteredData)) {
			// Table state altered, updating displayed data
			this.tableState.set({
				...currentState,
				displayedData: filteredData,
				globalSearchTerm,
				columnSearchTerms: columnSearchTermsObj,
			});
		}
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
