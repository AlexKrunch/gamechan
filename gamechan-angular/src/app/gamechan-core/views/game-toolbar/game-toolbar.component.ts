import { Component, OnInit } from '@angular/core';
import {GameUiService} from '../../services/game-ui.service';
import ToolModel from '../../models/tool.model';
import InteractionModel from '../../models/interaction.model';

@Component({
  selector: 'app-game-toolbar',
  templateUrl: './game-toolbar.component.html',
  styleUrls: ['./game-toolbar.component.css']
})
export class GameToolbarComponent implements OnInit {

  readonly listTool = ToolModel.LIST_TOOLS;
  toolCurrent : ToolModel = this.listTool[0];


  constructor(private gameUiService : GameUiService) { }

  ngOnInit() {
  }

  toolChanged(tool_) {
    console.log(tool_)
    this.toolCurrent.type = tool_.type;
    this.upadetTheTool();

  }

  toolPropertyChanged(prop_) {
    this.upadetTheTool();
  }

  //Notify all the programm than the tool has changed
  private upadetTheTool(){

    let inter: InteractionModel = new InteractionModel();
    inter.type =  InteractionModel.TYPE_TOOL;
    inter.value =  this.toolCurrent;
    this.gameUiService.changeTool( inter );

  }

}
