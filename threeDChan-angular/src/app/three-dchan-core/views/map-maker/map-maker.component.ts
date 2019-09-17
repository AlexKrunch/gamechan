import { Component, OnInit } from '@angular/core';

//Declare movable
//https://github.com/daybrush/moveable
//import '../../libs/moveable.min.js';
declare const Moveable: any;

@Component({
  selector: 'app-map-maker',
  templateUrl: './map-maker.component.html',
  styleUrls: ['./map-maker.component.css']
})
export class MapMakerComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    //creating the stuff
    const moveable = new Moveable(document.body, {
      target: document.querySelector(".target"),
      // If the container is null, the position is fixed. (default: parentElement(document.body))
      container: document.body,
      draggable: true,
      resizable: true,
      scalable: true,
      rotatable: true,
      warpable: true,
      // Enabling pincable lets you use events that
      // can be used in draggable, resizable, scalable, and rotateable.
      pinchable: true, // ["resizable", "scalable", "rotatable"]
      origin: true,
      keepRatio: true,
      // Resize, Scale Events at edges.
      edge: false,
      throttleDrag: 0,
      throttleResize: 0,
      throttleScale: 0,
      throttleRotate: 0,
    });

  }

}
