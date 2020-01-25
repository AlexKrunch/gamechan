import { Component, OnInit } from '@angular/core';
import {GameUiService} from '../../services/game-ui.service';
import ToolModel from '../../models/tool.model';
import InteractionModel from '../../models/interaction.model';
import {DomSanitizer} from '@angular/platform-browser';
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
  base64File: any;
  propertyString: string;

  constructor(private gameUiService : GameUiService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    
    this.gameUiService.changeEditorToolEmitter.subscribe(interaction_ => {
      //this.toolCurrent = interaction_.value;
    });
  }

  toolChanged(tool_) {
    //console.log(tool_)
    //this.toolCurrent.type = tool_.type;
    this.upadetTheTool();

  }

  toolPropertyChanged(prop_) {
    this.upadetTheTool();
  }
  
  toolFileUpload(files_) {
    this.fileToUse = files_[0];
    let myReader:FileReader = new FileReader();
    myReader.onloadend = (e_) => {
      this.base64File = myReader.result;
    }
    myReader.readAsDataURL(this.fileToUse);
    this.blobImage =  this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(files_[0]));
    //this.upadetTheTool();
  }

  changeTool(e_){
    console.log("----Change tool-----");
    if(this.toolCurrent.type === ToolModel.LIST_TOOLS[2].type){
      this.toolCurrent.property = this.base64File;
    } else if(this.toolCurrent.type === ToolModel.LIST_TOOLS[4].type) {
      this.toolCurrent.property = this.propertyString;
    }
    console.log(this.toolCurrent.property);
    this.upadetTheTool();
  }

  //Notify all the programm than the tool has changed
  private upadetTheTool(){
    console.log('---- UPDATE TOOL----');
    let property = (this.toolCurrent.type === ToolModel.LIST_TOOLS[2].type)? this.toolCurrent.property = this.base64File: this.propertyString;
    let newTool = new ToolModel(this.toolCurrent.type, property, '');
    console.log(property);

    let inter: InteractionModel = new InteractionModel();
    inter.type =  InteractionModel.TYPE_TOOL;
    inter.value =  newTool;
    console.log(inter);
    this.gameUiService.changeTool( inter );

  }

}
