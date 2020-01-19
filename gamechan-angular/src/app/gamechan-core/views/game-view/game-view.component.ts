import { Component, OnInit } from '@angular/core';
import { Game } from '../../motor/game';
import { GameUiService } from '../../services/game-ui.service';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {

  public game : Game;

  constructor(private gameUIService : GameUiService) { }

  ngOnInit() {

    // Create our game class using the render canvas element
    this.game = new Game('renderCanvas');
    this.game.setUIService(this.gameUIService);
    this.game.initScene();

  }

}
