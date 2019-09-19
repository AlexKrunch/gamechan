import { Component, OnInit } from '@angular/core';
import { MapMotor } from '../../motor/map-motor';


//https://phaser.io/tutorials/how-to-use-phaser-with-typescript
declare const Phaser: any;

@Component({
  selector: 'app-map-maker',
  templateUrl: './map-maker.component.html',
  styleUrls: ['./map-maker.component.css']
})

export class MapMakerComponent implements OnInit {

  mapMotor : any;

  constructor() { }

  ngOnInit() {

    //creating game
    this.mapMotor = new MapMotor('renderCanvas');
    this.mapMotor. initGame();

  }

}
