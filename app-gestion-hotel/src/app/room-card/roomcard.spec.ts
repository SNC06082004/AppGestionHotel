import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Roomcard } from './roomcard';

describe('Roomcard', () => {
  let component: Roomcard;
  let fixture: ComponentFixture<Roomcard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Roomcard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Roomcard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
