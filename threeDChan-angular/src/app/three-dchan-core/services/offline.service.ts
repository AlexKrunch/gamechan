import { Injectable } from '@angular/core';
import MapModel from '../models/map.model';

@Injectable()
export class OfflineService {

  MAP_KEY: string = "map_key";

  constructor() { }

  saveMap(mapModel_ : MapModel){
    return localStorage.setItem(this.MAP_KEY, JSON.stringify(mapModel_));
  }

  getMap(){
    let data = localStorage.getItem(this.MAP_KEY);
    if(data != null ) return data;
    return new MapModel();
  }

}
