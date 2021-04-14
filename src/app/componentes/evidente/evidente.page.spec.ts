import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvidentePage } from './evidente.page';

describe('EvidentePage', () => {
  let component: EvidentePage;
  let fixture: ComponentFixture<EvidentePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvidentePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvidentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
