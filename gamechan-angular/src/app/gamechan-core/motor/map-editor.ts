
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
import DataMeshModel from '../models/data-mesh.model';

export default class MapEditor {

    private scene : BABYLON.Scene;
    private motorInstance: MapMakerMotor
    //Dictionnary of mesh --> data slot
    public blockDict: { [id: string] : BlockMesh; } = {};
    public ground: BABYLON.Mesh;

    //Manage selected mesh
    public blockSelected : BlockMesh;
    public currentTool : number;
    public pointerDragBehaviorXZ: BABYLON.PointerDragBehavior;

    //BASE SIZE
    public static get TILE_SIZE():number { return 2; }
    public static get MAP_SIZE():number { return 30; }

    public static get EDITOR_TOOL_SELECT():number { return 0; }
    public static get EDITOR_TOOL_ADD():number { return 1; }

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

                if( pickResult.pickedMesh.name.indexOf('block') >= 0){

                    if( this.currentTool == MapEditor.EDITOR_TOOL_SELECT) {
                        //Block
                        let block : BlockMesh = this.blockDict[pickResult.pickedMesh.name];
                        if( block ){
                            this.selectBlock(block);
                        }
                    }
                } else {
                    //If Ground
                    this.addBlock( pickResult.pickedPoint );
                   
                }

            }
        }
    }

    public setTool(tool_){
        this.currentTool = tool_;
    }

    //create block
    public addBlock(point_ : BABYLON.Vector3){
        if( this.currentTool == MapEditor.EDITOR_TOOL_ADD) this.addWall(point_, null );
    }

    //wall
    public addWall(point_ : BABYLON.Vector3, blockModel_ : BlockModel){

        let blockModel = new BlockModel();

        blockModel.size.x = MapEditor.TILE_SIZE;
        blockModel.size.y = MapEditor.TILE_SIZE;
        blockModel.size.z = MapEditor.TILE_SIZE*0.2;

        if(blockModel_ == null){
            let pointRounded = this.magneticRounding(point_);
            blockModel.position.x = pointRounded.x;
            blockModel.pointOfImpact = pointRounded.y;
            blockModel.position.z = pointRounded.z;
        } else {
            blockModel = blockModel_;
            blockModel.position.x += MapEditor.TILE_SIZE;
            blockModel.position.z += MapEditor.TILE_SIZE; 
        }

        let block = new BlockMesh(blockModel, this.scene, this);
        this.selectBlock(block);
    }

    selectBlock(block_){

        if(this.blockSelected){
            this.blockSelected.setSelected(false);
            if(this.pointerDragBehaviorXZ != null) this.blockSelected.mesh.removeBehavior( this.pointerDragBehaviorXZ );
        } 

        if(this.pointerDragBehaviorXZ == null){
            this.pointerDragBehaviorXZ = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0,1,0)});
            this.pointerDragBehaviorXZ.useObjectOrienationForDragging = false;
    
            // Listen to drag events
            this.pointerDragBehaviorXZ.onDragEndObservable.add((event)=>{
                console.log("dragEnd");
                //console.log(event);
                if(this.blockSelected != null) this.blockSelected.updateMeshPosition();
                let interaction = new InteractionModel();
                interaction.type = InteractionModel.TYPE_MESH;
                interaction.value =  this.blockSelected.blockModel;
                this.motorInstance.gameUiService.sendInteraction(interaction);
            })
        }

        block_.setSelected(true);
        this.blockSelected = block_;
        this.blockSelected.mesh.addBehavior( this.pointerDragBehaviorXZ );

        let interaction = new InteractionModel();
        interaction.type = InteractionModel.TYPE_MESH;
        interaction.value =  this.blockSelected.blockModel;
        this.motorInstance.gameUiService.sendInteraction(interaction);
    }

    //create entity

    //create character

    //Edit mesh
    public editMesh(meshModel_ : BlockModel){
        let block : BlockMesh = this.blockDict[meshModel_.nameId];
        block.editMesh(meshModel_);
    }

    //Destroy
    deleteMesh (){
        //Desttroy it
        this.blockSelected.destroy();
        this.blockDict[ this.blockSelected.blockModel.nameId] = null;
    }

    //------
    //Select an object
 
    //Duplicate
    cloneMesh (meshModel_ : BlockModel){
       this.addWall(null, meshModel_);
    }
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