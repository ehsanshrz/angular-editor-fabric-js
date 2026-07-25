import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FabricjsEditorComponent } from './angular-editor-fabric-js.component';

describe('FabricjsLibraryComponent', () => {
  let component: FabricjsEditorComponent;
  let fixture: ComponentFixture<FabricjsEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FabricjsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FabricjsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
