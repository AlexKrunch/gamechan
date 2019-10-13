import { Component, OnInit } from '@angular/core';
import { MapMakerMotor } from '../../motor/map-maker-motor';
import InteractionModel from '../../models/interaction.model';
import {GameUiService} from '../../services/game-ui.service';


//https://phaser.io/tutorials/how-to-use-phaser-with-typescript
declare const Phaser: any;

@Component({
  selector: 'app-map-maker',
  templateUrl: './map-maker.component.html',
  styleUrls: ['./map-maker.component.css']
})

export class MapMakerComponent implements OnInit {

  mapMotor : any;
  currentInteraction: InteractionModel;
  currentTool: Number = 1; // add block

  constructor(private gameUIService : GameUiService) { 

  }

  ngOnInit() {

    //creating game
    this.mapMotor = new MapMakerMotor('renderCanvas');
    this.mapMotor.initUiService(this.gameUIService);
    this.mapMotor.initGame();

    //listen interactions
    this.gameUIService.sendInteractionsEmitter.subscribe( (inter_)=> {
      this.currentInteraction = inter_;
    });


  }

  /* Interactions */
  addMesh(){
    //console.log("addMesh()");
    this.mapMotor.addMesh();
  }

  onClickMap(){
    this.mapMotor.mapEditor.onClick();
  }

  saveMeshChange(){
    this.mapMotor.mapEditor.editMesh(this.currentInteraction.value);
  }

  changeTool(event_){
    console.log(event_);
    this.currentTool = event_;
  }

}
