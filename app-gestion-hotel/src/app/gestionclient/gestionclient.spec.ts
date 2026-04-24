import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gestionclient } from './gestionclient';

describe('Gestionclient', () => {
  let component: Gestionclient;
  let fixture: ComponentFixture<Gestionclient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gestionclient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gestionclient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
