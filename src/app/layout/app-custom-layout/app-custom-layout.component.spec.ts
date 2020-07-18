import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCustomLayoutComponent } from './app-custom-layout.component';

describe('AppCustomLayoutComponent', () => {
  let component: AppCustomLayoutComponent;
  let fixture: ComponentFixture<AppCustomLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCustomLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCustomLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
