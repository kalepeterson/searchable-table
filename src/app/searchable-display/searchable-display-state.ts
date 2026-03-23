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
		if (this.tableState() && this.tableState()?.globalSearchTerm !== queryString) {
			this.filterDataPipeline({ globalSearchTerm: queryString });
		}
	}

	performColumnQueries(columnSearch: { [columnHeader: string]: string }): void {
	if (this.tableState()) {
		const activeColumnSearches: { [columnHeader: string]: string } = {};
		for (const entry of Object.keys(this.tableState()!.columnSearchTerms || {})) {
			if (this.tableState()!.columnSearchTerms?.[entry]) {
				activeColumnSearches[entry] = this.tableState()!.columnSearchTerms?.[entry] ?? '' as string;
			}
		}
		const mergedColumnSearches = { ...activeColumnSearches, ...columnSearch };
		this.filterDataPipeline({ columnSearchTerms: mergedColumnSearches });
	}
}
	private filterDataPipeline({ globalSearchTerm, columnSearchTerms }: { globalSearchTerm?: string; columnSearchTerms?: { [columnHeader: string]: string } }): void {
		let currentState = this.tableState();
		if (!currentState) {
			return;
		}

		let filteredData = currentState.tableModel.data;
		
		let globalSearchValue = globalSearchTerm ?? currentState.globalSearchTerm ?? '';
		if (globalSearchValue) {
			filteredData = this.queryDisplayedColumns(filteredData, currentState.visibleColumns, globalSearchValue);
		}

		let columnSearchTermsObj = columnSearchTerms ?? currentState.columnSearchTerms;
		if (columnSearchTermsObj) {
			for (let columnHeader in columnSearchTermsObj) {
				let columnDef = currentState.tableModel.dataColumns.find(col => col.header === columnHeader);
				if (columnDef && columnSearchTermsObj[columnHeader]) {
					filteredData = this.queryIndividualColumn(filteredData, columnDef, columnSearchTermsObj[columnHeader]);
				}
			}
		}
		if (this.tableStateAltered(currentState, filteredData)) {
			this.tableState.set({
				...currentState,
				displayedData: filteredData,
				globalSearchTerm,
				columnSearchTerms: columnSearchTermsObj,
			});
		}
	}

	private queryDisplayedColumns(data: any[], columns: ColumnDefinition[], query: string): any[] {
		return data.filter(row => {
			for (let visibleColDef of columns) {
				if (this.matchCell(row, visibleColDef, query)) {
					return true;
				}
			}
			return false;
		});
	}

	private queryIndividualColumn(data: any[], column: ColumnDefinition, query: string): any[] {
		return data.filter(row => {
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
