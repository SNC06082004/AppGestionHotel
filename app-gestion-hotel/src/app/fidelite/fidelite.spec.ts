import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Fidelite } from './fidelite';

describe('FideliteComponent', () => {
  let component: Fidelite;
  let fixture: ComponentFixture<Fidelite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fidelite],
    }).compileComponents();

    fixture = TestBed.createComponent(Fidelite);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
