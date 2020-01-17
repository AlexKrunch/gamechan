import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonViewComponent } from './dungeon-view.component';

describe('DungeonViewComponent', () => {
  let component: DungeonViewComponent;
  let fixture: ComponentFixture<DungeonViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DungeonViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DungeonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
