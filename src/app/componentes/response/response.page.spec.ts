import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsePage } from './response.page';

describe('ResponsePage', () => {
  let component: ResponsePage;
  let fixture: ComponentFixture<ResponsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
