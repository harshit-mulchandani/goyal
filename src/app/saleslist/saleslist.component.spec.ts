import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleslistComponent } from './saleslist.component';

describe('SaleslistComponent', () => {
  let component: SaleslistComponent;
  let fixture: ComponentFixture<SaleslistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleslistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
