import { Component, OnInit } from '@angular/core';
import { Game } from '../../motor/game';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {

  public game : Game;

  constructor() { }

  ngOnInit() {

    // Create our game class using the render canvas element
    this.game = new Game('renderCanvas');
    this.game.initScene();

  }

}
