import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResponsePage } from './modal-response.page';

describe('ModalResponsePage', () => {
  let component: ModalResponsePage;
  let fixture: ComponentFixture<ModalResponsePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalResponsePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalResponsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
