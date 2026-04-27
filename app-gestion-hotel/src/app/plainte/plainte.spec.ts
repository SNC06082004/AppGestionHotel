import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Plainte } from './plainte';

describe('Plainte', () => {
  let component: Plainte;
  let fixture: ComponentFixture<Plainte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Plainte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Plainte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
