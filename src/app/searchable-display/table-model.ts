import { Signal } from '@angular/core';

//TODO: Use generics for valueDisplayMapper
export interface ColumnDefinition {
	header: string;
	searchable: boolean;
	sortable: boolean;
	valueDisplayMapper: (row: any) => string;
}

export interface ColumnVisibilityOptions {
	allowShowAll?: boolean;
	allowHideAll?: boolean;
	baseColumns: ColumnDefinition[];
	visibilityGroups?: { [groupName: string]: ColumnDefinition[] };
	defaultVisibilityGroup?: 'all' | 'none' | string;
}

//TODO: Use generics for clickAction
export interface ActionColumnDefinition {
	header: string;
	clickAction: (row: any) => Signal<any>;
}

export interface PaginationOptions {
	pageSizeOptions?: number[];
	pageButtons: ('all' | 'first-last' | 'next-previous')[];
}

export interface TableModel {
	actionColumns?: ActionColumnDefinition[];
	dataColumns: ColumnDefinition[];
	data: any[];
	pagination?: PaginationOptions;
	globalSearchable?: boolean;
	dataColumnVisibility?: ColumnVisibilityOptions;
}

export interface TableState {
	tableModel: TableModel;
	displayedData: any[];
	visibleColumns: ColumnDefinition[];
	currentPage?: number;
	pageSize?: number;
	globalSearchTerm?: string;
	columnSearchTerms?: { [columnHeader: string]: string | undefined };
	sortColumn?: string;
	sortDirection?: 'asc' | 'desc';
	visibilityGroup?: 'all' | 'none' | string;
}
