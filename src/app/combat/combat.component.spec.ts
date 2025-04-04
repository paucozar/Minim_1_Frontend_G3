import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombatComponent } from './combat.component';

describe('CombatComponent', () => {
  let component: CombatComponent;
  let fixture: ComponentFixture<CombatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CombatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
