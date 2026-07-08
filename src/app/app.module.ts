import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FabricjsEditorModule } from 'projects/angular-editor-fabric-js/src/public-api';
import { FormsModule } from '@angular/forms';
import { ColorPickerDirective } from 'ngx-color-picker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FabricjsEditorModule,
    FormsModule,
    ColorPickerDirective
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
