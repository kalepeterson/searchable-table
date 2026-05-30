import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableDisplay } from './searchable-display';
import { TableModel } from './table-model';

describe('SearchableDisplay', () => {
	let component: SearchableDisplay;
	let fixture: ComponentFixture<SearchableDisplay>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SearchableDisplay],
		}).compileComponents();

		const mockTableModel: TableModel = {
			dataColumns: [
				{ header: 'ID', searchable: false, sortable: true, valueDisplayMapper: (row) => row.id.toString() },
				{ header: 'Name', searchable: true, sortable: true, valueDisplayMapper: (row) => row.name },
			],
			rowIdentifier: (row) => row.id.toString(),
		};
		fixture = TestBed.createComponent(SearchableDisplay);
		fixture.componentRef.setInput('tableModel', mockTableModel);
		fixture.componentRef.setInput('dataRows', [
			{ id: 1, name: 'Row One' },
			{ id: 2, name: 'Row Two' },
		]);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
