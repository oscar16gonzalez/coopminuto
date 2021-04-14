import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreditsPage } from './list-credits.page';

describe('ListCreditsPage', () => {
  let component: ListCreditsPage;
  let fixture: ComponentFixture<ListCreditsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCreditsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCreditsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
