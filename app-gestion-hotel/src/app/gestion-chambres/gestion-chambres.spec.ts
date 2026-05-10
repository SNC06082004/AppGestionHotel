import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionChambres } from './gestion-chambres';

describe('GestionChambres', () => {
  let component: GestionChambres;
  let fixture: ComponentFixture<GestionChambres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionChambres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionChambres);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
