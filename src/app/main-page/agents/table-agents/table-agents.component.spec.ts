import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAgentsComponent } from './table-agents.component';

describe('TableAgentsComponent', () => {
  let component: TableAgentsComponent;
  let fixture: ComponentFixture<TableAgentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableAgentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
