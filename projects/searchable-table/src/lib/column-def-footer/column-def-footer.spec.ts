import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ColumnDefFooter } from './column-def-footer';
import { SearchableDisplayState } from '../searchable-display-state';
import { ActionColumnDefinition, ColumnDefinition, TableModel } from '../table-model';
import { TableState } from '../table-state';

describe('ColumnDefFooter', () => {
  let component: ColumnDefFooter;
  let fixture: ComponentFixture<ColumnDefFooter>;
  let stateService: SearchableDisplayState;

  const searchableColumn: ColumnDefinition = {
    header: 'Name',
    searchable: true,
    sortable: false,
    valueDisplayMapper: (row: any) => row.name,
  };

  const nonSearchableColumn: ColumnDefinition = {
    header: 'Age',
    searchable: false,
    sortable: false,
    valueDisplayMapper: (row: any) => row.age,
  };

  function createTableModel(overrides: Partial<TableModel> = {}): TableModel {
    const model = new TableModel();
    model.dataColumns = [searchableColumn];
    return Object.assign(model, overrides);
  }

  function createTableState(overrides: Partial<TableState> = {}): TableState {
    return {
      data: [],
      displayedData: [],
      filteredData: [],
      visibleColumns: [searchableColumn],
      ...overrides,
    };
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnDefFooter],
      providers: [SearchableDisplayState],
    }).compileComponents();

    stateService = TestBed.inject(SearchableDisplayState);
    fixture = TestBed.createComponent(ColumnDefFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render when tableState is undefined', () => {
    stateService.tableState.set(undefined);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tr')).toBeNull();
  });

  it('should render a row when tableState is defined', () => {
    stateService.tableModel.set(createTableModel());
    stateService.tableState.set(createTableState());
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('tr')).toBeTruthy();
  });

  it('should render a td for each visible column', () => {
    stateService.tableModel.set(createTableModel({ dataColumns: [searchableColumn, nonSearchableColumn] }));
    stateService.tableState.set(createTableState({ visibleColumns: [searchableColumn, nonSearchableColumn] }));
    fixture.detectChanges();
    const cells = fixture.nativeElement.querySelectorAll('td');
    expect(cells.length).toBe(2);
  });

  it('should render a search input for searchable columns', () => {
    stateService.tableModel.set(createTableModel());
    stateService.tableState.set(createTableState());
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="search"]');
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Search column...');
  });

  it('should not render a search input for non-searchable columns', () => {
    stateService.tableModel.set(createTableModel({ dataColumns: [nonSearchableColumn] }));
    stateService.tableState.set(createTableState({ visibleColumns: [nonSearchableColumn] }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input')).toBeNull();
  });

  it('should render empty start-action td cells and keep them empty', () => {
    const startAction: ActionColumnDefinition = {
      columnLocation: 'start',
      actionButtonDefinitions: [],
    };
    stateService.tableModel.set(createTableModel({ actionColumns: [startAction] }));
    stateService.tableState.set(createTableState());
    fixture.detectChanges();
    const cells = fixture.nativeElement.querySelectorAll('td');
    // 1 start-action placeholder + 1 data column = 2
    expect(cells.length).toBe(2);
    expect(cells[0].children.length).toBe(0);
  });

  it('should render empty end-action td cells and keep them empty', () => {
    const endAction: ActionColumnDefinition = {
      columnLocation: 'end',
      actionButtonDefinitions: [],
    };
    stateService.tableModel.set(createTableModel({ actionColumns: [endAction] }));
    stateService.tableState.set(createTableState());
    fixture.detectChanges();
    const cells = fixture.nativeElement.querySelectorAll('td');
    // 1 data column + 1 end-action placeholder = 2
    expect(cells.length).toBe(2);
    expect(cells[1].children.length).toBe(0);
  });

  it('should render correct number of placeholder tds for multiple start and end action columns', () => {
    const startAction1: ActionColumnDefinition = { columnLocation: 'start', actionButtonDefinitions: [] };
    const startAction2: ActionColumnDefinition = { columnLocation: 'start', actionButtonDefinitions: [] };
    const endAction: ActionColumnDefinition = { columnLocation: 'end', actionButtonDefinitions: [] };
    stateService.tableModel.set(createTableModel({ actionColumns: [startAction1, startAction2, endAction] }));
    stateService.tableState.set(createTableState());
    fixture.detectChanges();
    const cells = fixture.nativeElement.querySelectorAll('td');
    // 2 start + 1 data + 1 end = 4
    expect(cells.length).toBe(4);
  });

  it('should call updateColumnSearchTerm after debounce when input value changes', async () => {
    const updateSpy = vi.spyOn(stateService, 'updateColumnSearchTerm');
    stateService.tableModel.set(createTableModel());
    stateService.tableState.set(createTableState());
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="search"]');
    input.value = 'Alice';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(updateSpy).not.toHaveBeenCalled();

    await new Promise(resolve => setTimeout(resolve, 350));

    expect(updateSpy).toHaveBeenCalledWith({ columnHeader: 'Name', searchTerm: 'Alice' });
  });

  it('should not call updateColumnSearchTerm before the debounce time elapses', async () => {
    const updateSpy = vi.spyOn(stateService, 'updateColumnSearchTerm');
    stateService.tableModel.set(createTableModel());
    stateService.tableState.set(createTableState());
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="search"]');
    input.value = 'Bob';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(updateSpy).not.toHaveBeenCalled();

    await new Promise(resolve => setTimeout(resolve, 350));
    expect(updateSpy).toHaveBeenCalled();
  });

  it('should debounce rapid inputs and only emit the last value', async () => {
    const updateSpy = vi.spyOn(stateService, 'updateColumnSearchTerm');
    stateService.tableModel.set(createTableModel());
    stateService.tableState.set(createTableState());
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="search"]');

    input.value = 'A';
    input.dispatchEvent(new Event('input'));
    await new Promise(resolve => setTimeout(resolve, 100));

    input.value = 'Al';
    input.dispatchEvent(new Event('input'));
    await new Promise(resolve => setTimeout(resolve, 100));

    input.value = 'Ali';
    input.dispatchEvent(new Event('input'));
    await new Promise(resolve => setTimeout(resolve, 350));

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith({ columnHeader: 'Name', searchTerm: 'Ali' });
  });
});
