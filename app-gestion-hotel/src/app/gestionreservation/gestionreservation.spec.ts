import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gestionreservation } from './gestionreservation';

describe('Gestionreservation', () => {
  let component: Gestionreservation;
  let fixture: ComponentFixture<Gestionreservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gestionreservation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gestionreservation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
