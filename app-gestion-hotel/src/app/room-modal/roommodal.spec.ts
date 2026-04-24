import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Roommodal } from './roommodal';

describe('Roommodal', () => {
  let component: Roommodal;
  let fixture: ComponentFixture<Roommodal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Roommodal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Roommodal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
