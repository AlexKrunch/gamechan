import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MapMakerComponent } from './views/map-maker/map-maker.component';
import {GameUiService} from './services/game-ui.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    MapMakerComponent,
  ],
  providers: [GameUiService],
  exports: [MapMakerComponent]
})
export class GameChanCoreModule { }
