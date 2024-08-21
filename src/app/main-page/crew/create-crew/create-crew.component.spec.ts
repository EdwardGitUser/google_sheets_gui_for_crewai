import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCrewComponent } from './create-crew.component';

describe('CreateCrewComponent', () => {
  let component: CreateCrewComponent;
  let fixture: ComponentFixture<CreateCrewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCrewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCrewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
