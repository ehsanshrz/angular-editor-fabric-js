import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerDirective } from 'ngx-color-picker';

import { FabricjsEditorComponent } from './angular-editor-fabric-js.component';

@NgModule({
  declarations: [FabricjsEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ColorPickerDirective
  ],
  exports: [FabricjsEditorComponent]
})
export class FabricjsEditorModule { }
