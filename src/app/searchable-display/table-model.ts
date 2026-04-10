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

export interface ActionColumnDefinition {
  header?: string;
  columnLocation?: 'start' | 'end';
  actionButtonDefinitions: ActionButtonDefinition[];
}

//TODO: Use generics for clickAction
export interface ActionButtonDefinition {
  buttonText: string;
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
  displayedData: any[];
  filteredData: any[];
  visibleColumns: ColumnDefinition[];
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
