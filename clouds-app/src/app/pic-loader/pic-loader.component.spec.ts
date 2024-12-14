import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicLoaderComponent } from './pic-loader.component';

describe('PicLoaderComponent', () => {
  let component: PicLoaderComponent;
  let fixture: ComponentFixture<PicLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PicLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PicLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
