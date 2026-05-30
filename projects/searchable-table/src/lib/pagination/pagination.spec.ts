import { ComponentFixture, TestBed } from '@angular/core/testing';

import Pagination from './pagination';
import { SearchableDisplayState } from '../searchable-display-state';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
      providers: [
        {
          provide: SearchableDisplayState,
          useValue: new SearchableDisplayState(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
