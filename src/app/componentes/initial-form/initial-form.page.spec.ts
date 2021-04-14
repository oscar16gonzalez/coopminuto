import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialFormPage } from './initial-form.page';

describe('InitialFormPage', () => {
  let component: InitialFormPage;
  let fixture: ComponentFixture<InitialFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
