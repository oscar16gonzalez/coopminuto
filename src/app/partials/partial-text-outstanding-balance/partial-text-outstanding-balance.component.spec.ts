import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialTextOutstandingBalanceComponent } from './partial-text-outstanding-balance.component';

describe('PartialTextOutstandingBalanceComponent', () => {
  let component: PartialTextOutstandingBalanceComponent;
  let fixture: ComponentFixture<PartialTextOutstandingBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartialTextOutstandingBalanceComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialTextOutstandingBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
