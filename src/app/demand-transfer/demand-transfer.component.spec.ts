import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandTransferComponent } from './demand-transfer.component';

describe('DemandTransferComponent', () => {
  let component: DemandTransferComponent;
  let fixture: ComponentFixture<DemandTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
