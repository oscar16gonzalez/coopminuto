import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarePage } from './pagare.page';

describe('PagarePage', () => {
  let component: PagarePage;
  let fixture: ComponentFixture<PagarePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagarePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagarePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
