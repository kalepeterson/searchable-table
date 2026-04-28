import { ColumnDefinition } from "./table-model";

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