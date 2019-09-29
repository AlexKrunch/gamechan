import { Injectable, EventEmitter } from '@angular/core';
import InteractionModel from '../models/interaction.model';

@Injectable()
export class GameUiService {

  public changeStateEmitter = new EventEmitter<number>();
  public sendInteractionsEmitter = new EventEmitter<InteractionModel>();

  public static get STATE_GAME_RUNNING():number { return 0; }
  public static get STATE_GAME_OTHER():number { return 1; }

  private gameState : number =  GameUiService.STATE_GAME_RUNNING;

  constructor() { }

  public sendInteraction(interact_ : InteractionModel){
    this.sendInteractionsEmitter.emit( interact_);
  }

}
