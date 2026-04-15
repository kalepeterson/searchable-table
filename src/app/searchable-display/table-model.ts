import { Signal } from '@angular/core';

export interface ColumnDefinition<T = any> {
  header: string;
  searchable: boolean;
  sortable: boolean;
  valueDisplayMapper: (row: T) => string;
}

export interface ColumnVisibilityOptions<T = any> {
  allowShowAll?: boolean;
  allowHideAll?: boolean;
  baseColumns: ColumnDefinition<T>[];
  visibilityGroups?: { [groupName: string]: ColumnDefinition<T>[] };
  defaultVisibilityGroup?: 'all' | 'none' | string;
}

export interface ActionColumnDefinition<T = any> {
  header?: string;
  columnLocation?: 'start' | 'end';
  actionButtonDefinitions: ActionButtonDefinition<T>[];
}

export interface ActionButtonDefinition<T = any> {
  buttonText: string;
  clickAction: (row: T) => Signal<any>;
}

export interface PaginationOptions {
  pageSizeOptions?: number[];
  pageButtons: ('all' | 'first-last' | 'next-previous')[];
}

export class TableModel<T = any> {
  actionColumns?: ActionColumnDefinition<T>[];
  dataColumns: ColumnDefinition<T>[] = [];
  rowIdentifier: (row: T) => string = (row) => JSON.stringify(row);
  pagination?: PaginationOptions;
  globalSearchable?: boolean;
  dataColumnVisibility?: ColumnVisibilityOptions<T>;
}

export interface TableState<T = any> {
  data: T[];
  displayedData: T[];
  filteredData: T[];
  visibleColumns: ColumnDefinition<T>[];
  currentPage?: number;
  pageSize?: number;
  globalSearchTerm?: string;
  columnSearchTerms?: ColumnSearchTerm[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  visibilityGroup?: 'all' | 'none' | string;
}

export interface ColumnSearchTerm {
  columnHeader: string;
  searchTerm: string | undefined;
}
