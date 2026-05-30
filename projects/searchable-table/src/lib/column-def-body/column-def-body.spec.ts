import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { ColumnDefBody } from './column-def-body';
import { SearchableDisplayState } from '../searchable-display-state';
import { ActionColumnDefinition, ColumnDefinition, TableModel } from '../table-model';
import { TableState } from '../table-state';

describe('ColumnDefBody', () => {
	let component: ColumnDefBody;
	let fixture: ComponentFixture<ColumnDefBody>;
	let stateService: SearchableDisplayState;

	const nameColumn: ColumnDefinition = {
		header: 'Name',
		searchable: true,
		sortable: true,
		valueDisplayMapper: (row: any) => row.name,
	};

	function createTableModel(overrides: Partial<TableModel> = {}): TableModel {
		const model = new TableModel();
		model.dataColumns = [nameColumn];
		return Object.assign(model, overrides);
	}

	function createTableState(overrides: Partial<TableState> = {}): TableState {
		return {
			data: [],
			displayedData: [],
			filteredData: [],
			visibleColumns: [nameColumn],
			...overrides,
		};
	}

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ColumnDefBody],
			providers: [SearchableDisplayState],
		}).compileComponents();

		stateService = TestBed.inject(SearchableDisplayState);
		fixture = TestBed.createComponent(ColumnDefBody);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should not render rows when tableState is undefined', () => {
		stateService.tableState.set(undefined);
		fixture.detectChanges();
		const rows = fixture.nativeElement.querySelectorAll('tr');
		expect(rows.length).toBe(0);
	});

	it('should not render rows when tableModel is undefined', () => {
		stateService.tableModel.set(undefined);
		stateService.tableState.set(createTableState({ displayedData: [{ id: '1', name: 'Alice' }] }));
		fixture.detectChanges();
		const rows = fixture.nativeElement.querySelectorAll('tr');
		expect(rows.length).toBe(0);
	});

	it('should render a row for each item in displayedData', () => {
		stateService.tableModel.set(createTableModel());
		stateService.tableState.set(createTableState({
			displayedData: [
				{ id: '1', name: 'Alice' },
				{ id: '2', name: 'Bob' },
			],
		}));
		fixture.detectChanges();
		const rows = fixture.nativeElement.querySelectorAll('tr');
		expect(rows.length).toBe(2);
	});

	it('should render a cell for each visible column', () => {
		stateService.tableModel.set(createTableModel());
		stateService.tableState.set(createTableState({
			displayedData: [{ id: '1', name: 'Alice' }],
		}));
		fixture.detectChanges();
		const cells = fixture.nativeElement.querySelectorAll('tr:first-child td');
		expect(cells.length).toBe(1);
	});

	it('should display column values using valueDisplayMapper', () => {
		stateService.tableModel.set(createTableModel());
		stateService.tableState.set(createTableState({
			displayedData: [{ id: '1', name: 'Alice' }],
		}));
		fixture.detectChanges();
		const span = fixture.nativeElement.querySelector('td span');
		expect(span.textContent.trim()).toBe('Alice');
	});

	it('should not render a fieldset when a column has no cell action buttons', () => {
		stateService.tableModel.set(createTableModel());
		stateService.tableState.set(createTableState({
			displayedData: [{ id: '1', name: 'Alice' }],
		}));
		fixture.detectChanges();
		expect(fixture.nativeElement.querySelector('fieldset')).toBeNull();
	});

	it('should render cell action buttons inside a fieldset when present', () => {
		const clickFn = vi.fn().mockReturnValue(vi.fn());
		const columnWithActions: ColumnDefinition = {
			...nameColumn,
			cellActionButtons: [{ buttonText: 'View', clickAction: clickFn }],
		};
		stateService.tableModel.set(createTableModel({ dataColumns: [columnWithActions] }));
		stateService.tableState.set(createTableState({
			displayedData: [{ id: '1', name: 'Alice' }],
			visibleColumns: [columnWithActions],
		}));
		fixture.detectChanges();
		const fieldset = fixture.nativeElement.querySelector('fieldset');
		expect(fieldset).toBeTruthy();
		const button = fieldset.querySelector('button');
		expect(button).toBeTruthy();
		expect(button.textContent.trim()).toBe('View');
	});

	it('should render start action columns before data columns', () => {
		const actionCol: ActionColumnDefinition = {
			columnLocation: 'start',
			actionButtonDefinitions: [
				{ buttonText: 'Edit', clickAction: vi.fn().mockReturnValue(vi.fn()) },
			],
		};
		stateService.tableModel.set(createTableModel({ actionColumns: [actionCol] }));
		stateService.tableState.set(createTableState({
			displayedData: [{ id: '1', name: 'Alice' }],
		}));
		fixture.detectChanges();
		const cells = fixture.nativeElement.querySelectorAll('tr:first-child td');
		expect(cells.length).toBe(2);
		expect(cells[0].querySelector('a[role="button"]')).toBeTruthy();
		expect(cells[0].querySelector('a').textContent.trim()).toBe('Edit');
	});

	it('should render end action columns after data columns', () => {
		const actionCol: ActionColumnDefinition = {
			columnLocation: 'end',
			actionButtonDefinitions: [
				{ buttonText: 'Delete', clickAction: vi.fn().mockReturnValue(vi.fn()) },
			],
		};
		stateService.tableModel.set(createTableModel({ actionColumns: [actionCol] }));
		stateService.tableState.set(createTableState({
			displayedData: [{ id: '1', name: 'Alice' }],
		}));
		fixture.detectChanges();
		const cells = fixture.nativeElement.querySelectorAll('tr:first-child td');
		expect(cells.length).toBe(2);
		expect(cells[1].querySelector('button')).toBeTruthy();
		expect(cells[1].querySelector('button').textContent.trim()).toBe('Delete');
	});

	it('should apply cellClasses from tableStyles to data cells', () => {
		stateService.tableModel.set(createTableModel());
		stateService.tableState.set(createTableState({
			displayedData: [{ id: '1', name: 'Alice' }],
		}));
		stateService.setTableStyles({ cellClasses: () => 'highlight-cell' });
		fixture.detectChanges();
		const cell = fixture.nativeElement.querySelector('td');
		expect(cell.getAttribute('class')).toContain('highlight-cell');
	});

	it('should apply actionCellClasses from tableStyles to cell action buttons', () => {
		const clickFn = vi.fn().mockReturnValue(vi.fn());
		const columnWithActions: ColumnDefinition = {
			...nameColumn,
			cellActionButtons: [{ buttonText: 'View', clickAction: clickFn }],
		};
		stateService.tableModel.set(createTableModel({ dataColumns: [columnWithActions] }));
		stateService.tableState.set(createTableState({
			displayedData: [{ id: '1', name: 'Alice' }],
			visibleColumns: [columnWithActions],
		}));
		stateService.setTableStyles({ actionCellClasses: () => 'action-btn' });
		fixture.detectChanges();
		const button = fixture.nativeElement.querySelector('fieldset button');
		expect(button.getAttribute('class')).toContain('action-btn');
	});

	it('should apply actionCellClasses from tableStyles to end action column buttons', () => {
		const actionCol: ActionColumnDefinition = {
			columnLocation: 'end',
			actionButtonDefinitions: [
				{ buttonText: 'Delete', clickAction: vi.fn().mockReturnValue(vi.fn()) },
			],
		};
		stateService.tableModel.set(createTableModel({ actionColumns: [actionCol] }));
		stateService.tableState.set(createTableState({
			displayedData: [{ id: '1', name: 'Alice' }],
		}));
		stateService.setTableStyles({ actionCellClasses: () => 'end-action-btn' });
		fixture.detectChanges();
		const button = fixture.nativeElement.querySelector('td button');
		expect(button.getAttribute('class')).toContain('end-action-btn');
	});

	it('should call clickAction when a start action link is clicked', () => {
		const innerFn = vi.fn();
		const clickFn = vi.fn().mockReturnValue(innerFn);
		const actionCol: ActionColumnDefinition = {
			columnLocation: 'start',
			actionButtonDefinitions: [{ buttonText: 'Edit', clickAction: clickFn }],
		};
		const row = { id: '1', name: 'Alice' };
		stateService.tableModel.set(createTableModel({ actionColumns: [actionCol] }));
		stateService.tableState.set(createTableState({ displayedData: [row] }));
		fixture.detectChanges();
		fixture.nativeElement.querySelector('a[role="button"]').click();
		expect(clickFn).toHaveBeenCalledWith(row);
		expect(innerFn).toHaveBeenCalled();
	});

	it('should call clickAction when an end action button is clicked', () => {
		const innerFn = vi.fn();
		const clickFn = vi.fn().mockReturnValue(innerFn);
		const actionCol: ActionColumnDefinition = {
			columnLocation: 'end',
			actionButtonDefinitions: [{ buttonText: 'Delete', clickAction: clickFn }],
		};
		const row = { id: '1', name: 'Alice' };
		stateService.tableModel.set(createTableModel({ actionColumns: [actionCol] }));
		stateService.tableState.set(createTableState({ displayedData: [row] }));
		fixture.detectChanges();
		fixture.nativeElement.querySelector('td button').click();
		expect(clickFn).toHaveBeenCalledWith(row);
		expect(innerFn).toHaveBeenCalled();
	});

	it('should call clickAction when a cell action button is clicked', () => {
		const innerFn = vi.fn();
		const clickFn = vi.fn().mockReturnValue(innerFn);
		const columnWithActions: ColumnDefinition = {
			...nameColumn,
			cellActionButtons: [{ buttonText: 'View', clickAction: clickFn }],
		};
		const row = { id: '1', name: 'Alice' };
		stateService.tableModel.set(createTableModel({ dataColumns: [columnWithActions] }));
		stateService.tableState.set(createTableState({
			displayedData: [row],
			visibleColumns: [columnWithActions],
		}));
		fixture.detectChanges();
		fixture.nativeElement.querySelector('fieldset button').click();
		expect(clickFn).toHaveBeenCalledWith(row);
		expect(innerFn).toHaveBeenCalled();
	});
});
