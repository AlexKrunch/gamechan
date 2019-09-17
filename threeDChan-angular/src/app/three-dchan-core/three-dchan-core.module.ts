import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapMakerComponent } from './views/map-maker/map-maker.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [MapMakerComponent],
  exports: [MapMakerComponent]
})
export class ThreeDchanCoreModule { }
