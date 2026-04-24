import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addchambre } from './addchambre';

describe('Addchambre', () => {
  let component: Addchambre;
  let fixture: ComponentFixture<Addchambre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addchambre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addchambre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
