import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {GameUiService} from './services/game-ui.service';
import { DungeonViewComponent } from './views/dungeon-view/dungeon-view.component';
import { GameViewComponent } from './views/game-view/game-view.component';
import { GameToolbarComponent } from './views/game-toolbar/game-toolbar.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    DungeonViewComponent,
    GameViewComponent,
    GameToolbarComponent,
  ],
  providers: [GameUiService],
  exports: [DungeonViewComponent, GameViewComponent]
})
export class GameChanCoreModule { }
