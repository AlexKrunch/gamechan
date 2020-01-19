import { Injectable, EventEmitter } from '@angular/core';
import InteractionModel from '../models/interaction.model';

@Injectable()
export class GameUiService {

  public changeStateEmitter = new EventEmitter<number>();
  public sendInteractionsEmitter = new EventEmitter<InteractionModel>();
  public changeEditorToolEmitter = new EventEmitter<InteractionModel>();

  public static get STATE_GAME_RUNNING():number { return 0; }
  public static get STATE_GAME_OTHER():number { return 1; }
  public static get STATE_EDITOR_TOOL_SELECT():number { return 0; }
  public static get STATE_EDITOR_TOOL_ADD():number { return 1; }

  private gameState : number =  GameUiService.STATE_GAME_RUNNING;
  private editorTool : number =  GameUiService.STATE_EDITOR_TOOL_ADD;

  constructor() { }

  public sendInteraction(interact_ : InteractionModel){
    this.sendInteractionsEmitter.emit( interact_);
  }

  public changeTool(interact_ : InteractionModel){
    this.changeEditorToolEmitter.emit( interact_);
  }

}
