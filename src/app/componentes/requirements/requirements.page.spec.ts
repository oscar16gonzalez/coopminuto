import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementsPage } from './requirements.page';

describe('RequirementsPage', () => {
  let component: RequirementsPage;
  let fixture: ComponentFixture<RequirementsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequirementsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
