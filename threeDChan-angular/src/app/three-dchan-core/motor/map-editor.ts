
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
import BlockModel from '../models/block.model';
import { MapMakerMotor } from './map-maker-motor';
import InteractionModel from '../models/interaction.model';

export default class MapEditor {

    private scene : BABYLON.Scene;
    private motorInstance: MapMakerMotor
    //Dictionnary of mesh --> data slot
    public blockDict: { [id: string] : BlockMesh; } = {};
    public ground: BABYLON.Mesh;

    //Manage selected mesh
    public blockSelected : BlockMesh;

    //BASE SIZE
    public static get TILE_SIZE():number { return 2; }
    public static get MAP_SIZE():number { return 30; }

    constructor(scene_: BABYLON.Scene, motorInstance_: MapMakerMotor) {

        this.motorInstance = motorInstance_;
        this.scene = scene_;
        //init the block dict
        this.blockDict = {};
        
    }

    public initMap(){
        this.ground = BABYLON.MeshBuilder.CreateGround("ground", {width: MapEditor.MAP_SIZE*MapEditor.TILE_SIZE, height: MapEditor.MAP_SIZE*MapEditor.TILE_SIZE}, this.scene);
    }

    /********************
     * REGISTER OBJECTS
     ********************/

    registrerBlock(blockMesh_: BlockMesh){
        this.blockDict[blockMesh_.blockModel.nameId] = blockMesh_;
    }

    /********************
     * INTERACTION
     ********************/

    public onClick(){
        if(this.scene){
            let pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
            if (pickResult.hit) {

                console.log(pickResult.pickedMesh.name);
                if( pickResult.pickedMesh.name.indexOf('block') >= 0){
                    //Block
                    let block : BlockMesh = this.blockDict[pickResult.pickedMesh.name];
                    if(block ){
                        this.selectBlock(block);
                    }

                } else {
                    //If Ground
                    this.addBlock( pickResult.pickedPoint );
                   
                }

            }
        }
    }

    //create block
    public addBlock(point_ : BABYLON.Vector3){
        /*
        let blockModel = new BlockModel();
        blockModel.size.x = MapEditor.TILE_SIZE;
        blockModel.size.y = MapEditor.TILE_SIZE;
        blockModel.size.z = MapEditor.TILE_SIZE;
        let block = new BlockMesh(blockModel, this.scene);
        let pointRounded = this.magneticRounding(point_);
        block.placeToImpact(pointRounded);*/

        this.addWall(point_ );
    }

    //wall
    public addWall(point_ : BABYLON.Vector3){

        let blockModel = new BlockModel();
        blockModel.size.x = MapEditor.TILE_SIZE;
        blockModel.size.y = MapEditor.TILE_SIZE;
        blockModel.size.z = MapEditor.TILE_SIZE*0.2;

        let block = new BlockMesh(blockModel, this.scene, this);
        block.setSelected(true);
        let pointRounded = this.magneticRounding(point_);
        block.placeToImpact(pointRounded);

        this.selectBlock(block);
    }

    selectBlock(block_){
        if(this.blockSelected) this.blockSelected.setSelected(false);
        block_.setSelected(true);
        this.blockSelected = block_;

        let interaction = new InteractionModel();
        interaction.type = InteractionModel.TYPE_MESH;
        interaction.value =  this.blockSelected.blockModel;
        this.motorInstance.gameUiService.sendInteraction(interaction);
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