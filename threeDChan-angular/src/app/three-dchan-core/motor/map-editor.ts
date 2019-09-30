
import {
    Engine, Scene,FreeCamera, Light,
    DirectionalLight, HemisphericLight, ShadowGenerator,
    Color4, Color3Gradient, Mesh, AbstractMesh,
    Vector3, MeshBuilder, ArcRotateCamera,
    StandardMaterial, Texture, Color3, PointLight,
} from 'babylonjs'

import MapModel from '../models/map.model';
import BlockMesh  from './mesh/block-mesh';
import { initDomAdapter } from '@angular/platform-browser/src/browser';

export default class MapEditor {

    private scene : BABYLON.Scene;
    //Dictionnary of mesh --> data slot
    public blockDict: { [id: string] : BlockMesh; } = {};
    public ground: BABYLON.Mesh;

    //BASE SIZE
    public static get TILE_SIZE():number { return 2; }
    public static get MAP_SIZE():number { return 30; }

    constructor(scene_: BABYLON.Scene) {

        this.scene = scene_;
        
    }

    public initMap(){
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", {width: MapEditor.MAP_SIZE, height: MapEditor.MAP_SIZE}, this.scene);
    }

    /********************
     * INTERACTION
     ********************/
    public onClick(){
        if(this.scene){
            let pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
            if (pickResult.hit) {
                this.addBlock( pickResult.pickedPoint );
            }
        }
    }

    //create block
    public addBlock(point_ : BABYLON.Vector3){
        let block = new BlockMesh(null, this.scene);
        let pointRounded = this.magneticRounding(point_);
        block.placeToImpact(pointRounded);
    }

    //create entity

    //create character

    //point a stuff, ask what it is?
    //+select it

    //------
    //Select an object
    //Destroy
    //Duplicate
    //Modify

    /****************
     * UTILS
     ****************/

     //Magnetic rounding
    magneticRounding(point_: BABYLON.Vector3){
        let  x = Math.round(point_.x / MapEditor.TILE_SIZE)* MapEditor.TILE_SIZE;
        let  y = Math.round(point_.y / MapEditor.TILE_SIZE)* MapEditor.TILE_SIZE;
        let  z = Math.round(point_.z / MapEditor.TILE_SIZE)* MapEditor.TILE_SIZE;
        return new BABYLON.Vector3(x, y, z);
    }

}