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
  fileToUse : any;
  blobImage: any;
  propertyString: string;

  constructor(private gameUiService : GameUiService) { }

  ngOnInit() {
    
    this.gameUiService.changeEditorToolEmitter.subscribe(interaction_ => {
      this.toolCurrent = interaction_.value;
    });
  }

  toolChanged(tool_) {
    console.log(tool_)
    this.toolCurrent.type = tool_.type;
    this.upadetTheTool();

  }

  toolPropertyChanged(prop_) {
    this.upadetTheTool();
  }
  
  toolFileUpload(files_) {
    this.fileToUse = files_.item(0);
    this.blobImage = URL.createObjectURL(files_[0]);
    this.upadetTheTool();
  }

  changeTool(e_){
    if(this.toolCurrent.type === ToolModel.LIST_TOOLS[2]){
      this.toolCurrent.property = this.fileToUse;
    } else if(this.toolCurrent.type === ToolModel.LIST_TOOLS[4]) {
      this.toolCurrent.property = this.propertyString;
    }
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
