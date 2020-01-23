import { Scene, StandardMaterial, Mesh, MeshBuilder, Texture, Vector3, Color3 } from "babylonjs";
import { GameUiService } from '../services/game-ui.service';
import ToolModel from "../models/tool.model";

export class Map{

    public static EDITION_MODE = {
        SELECT: 'select',
        BLOCK_ADD: 'block_add',
        TEXTURE_ADD: 'texture_add',
        CANVAS_ADD: 'canvas_add',
        CANVAS_DRAG: 'canvas_drag',
        ITEM_DROP: 'item_drop',
        DELETE: 'delete',
    }
    
    private currentTool = new ToolModel(Map.EDITION_MODE.SELECT, null, null) ;
    private gameUIService : GameUiService;

    private scene: Scene;
    private mapData: number[];
    private mapWidth: number = 6;
    private mapHeight: number = 7;
    private blockSize: number = 8;

    private ghostMeshPainting: Mesh; //mesh to display to impact point
    private ghostMeshBuilding: Mesh;
  
    private canvasSelected: Mesh;


    constructor(scene_, service_: GameUiService){
        this.scene = scene_;

        this.gameUIService = service_;
        this.gameUIService.changeEditorToolEmitter.subscribe(interaction_ => {
          
            this.currentTool = interaction_.value;
            this.canvasSelected = null;
            
           if(this.currentTool.type === Map.EDITION_MODE.BLOCK_ADD){
              this.ghostMeshBuilding.isVisible = true;
              this.ghostMeshPainting.isVisible = false;
           } else if(this.currentTool.type === Map.EDITION_MODE.TEXTURE_ADD){
              this.ghostMeshBuilding.isVisible = false;
              this.ghostMeshPainting.isVisible = true;
           } else {
              this.ghostMeshBuilding.isVisible = false;
              this.ghostMeshPainting.isVisible = false;
           }
        });

        this.mapData = [
            1,1,1,1,1,1,
            1,0,0,0,0,1,
            1,0,1,1,0,1,
            1,0,0,0,0,1,
            1,0,2,0,0,1,
            1,0,0,0,0,1,
            1,1,1,1,1,1,
        ];

        //Construct the scene
        this.displayMap();

        //init hte ghost mesh for painting
        this.ghostMeshPainting = MeshBuilder.CreateBox("ghost_tile", {size: this.blockSize},  this.scene);
        this.ghostMeshPainting.isPickable = false;
        //Add wireframe texture
        let matGhost : StandardMaterial = new StandardMaterial("matGhost_text", this.scene);
        matGhost.wireframe = true;
        matGhost.emissiveColor = Color3.Green();
        this.ghostMeshPainting.material = matGhost;
        
        //Ghost mesh for building
        this.ghostMeshBuilding = MeshBuilder.CreateBox("ghost_box", {size: this.blockSize},  this.scene);
        this.ghostMeshBuilding.isPickable = false;
        //Add wireframe texture
        let matGhost : StandardMaterial = new StandardMaterial("matGhostBox_text", this.scene);
        matGhost.emissiveColor = Color3.Green();
        this.ghostMeshPainting.material = matGhost;

        //prepare the pointer
        this.scene.pointerMovePredicate = function(mesh) {
            //Try to class 
            return mesh.isPickable;
        }

        this.scene.pointerUpPredicate = function(mesh) {
            return mesh.isPickable;
        }
    
        //When pointer down event is raised
        this.scene.onPointerMove = (evt, pickResult) => {
           if(pickResult.hit){
              
               if(this.currentTool.type === Map.EDITION_MODE.BLOCK_ADD){
                  //IF BUILD block
                  if(pickResult.pickedMesh.name.indexOf('ground')>-1) this.moveGhostMeshBox(pickResult.pickedPoint);
               } else if (this.currentTool.type === Map.EDITION_MODE.TEXTURE_ADD){
                 //IF texture paint
                  if(pickResult.pickedMesh.name.indexOf('wall')>-1) this.moveGhostMeshPainting(pickResult.pickedPoint);
               } else if(this.currentTool.type === Map.EDITION_MODE.TEXTURE_ADD){
                 //IF DRAG CANVAS
                 if(pickResult.pickedMesh.name.indexOf('wall')>-1) this.moveSelectedCanvas(pickResult.pickedPoint);
               }
              
           }
        };

        this.scene.onPointerUp = (evt, pickResult) => {
            if(pickResult.hit){
              if(this.currentTool.type === Map.EDITION_MODE.BLOCK_ADD){
                if(pickResult.pickedMesh.name.indexOf('ground')>-1){
                  this.makeBlock(this.ghostMesh.position.x, this.ghostMesh.position.z,'./assets/textures/concrete_text.jpg');
                }
              } else if(this.currentTool.type === Map.EDITION_MODE.TEXTURE_ADD){
                  if(pickResult.pickedMesh.name.indexOf('wall')>-1){
                      let mesh = pickResult.pickedMesh;
                      let mat = new StandardMaterial("matGround", this.scene);
                      //let textureBox = new Texture('https://pbs.twimg.com/media/EOoDty5XkAANDcZ?format=jpg&name=small', this.scene);
                      //https://66.media.tumblr.com/3df4af53fc817dd4e19c86d97209b8a4/tumblr_o36fyc6raW1sw7bx5o1_540.jpg
                      //let textureBox = new Texture('https://pbs.twimg.com/media/EOpI7_3WsAA1hkU?format=jpg&name=360x360', this.scene);
                      let textureBox =  new Texture(this.currentTool.property, this.scene);
                      mat.diffuseTexture = textureBox;
                      mat.diffuseTexture.scale(1/4) ;
                      mesh.material = mat;
                  }
              } else if(this.currentTool.type === Map.EDITION_MODE.CANVAS_ADD){
                  if(pickResult.pickedMesh.name.indexOf('wall')>-1){
                    this.canvasSelected = this.makeCanvas(pickResult.pickedPoint.x, pickResult.pickedPoint.y, pickResult.pickedPoint.z, "https://pbs.twimg.com/media/EOklPtoX4AAkQ_z?format=jpg&name=small");
                    this.currentTool.type = Map.EDITION_MODE.CANVAS_DRAG;
                  }
              } else if(this.currentTool.type === Map.EDITION_MODE.CANVAS_DRAG){
                 this.canvasSelected = null;
                 this.currentTool.type = Map.EDITION_MODE.SELECT;
              }
              
            }
         };

    }

    private displayMap(){

        let x = 0;
        let z = 0;
        //Create the walls
        //N
        for(x = 0; x < this.mapWidth; x++) this.makeBlock(x* this.blockSize,z* this.blockSize,'./assets/textures/concrete_text.jpg');

        z =  this.mapHeight;
        for(x = 0; x < this.mapWidth; x++) this.makeBlock(x* this.blockSize,z* this.blockSize,'./assets/textures/concrete_text.jpg');

        x = 0;
        for(z = 0; z < this.mapHeight; z++) this.makeBlock(x* this.blockSize,z* this.blockSize,'./assets/textures/concrete_text.jpg');

        x = this.mapWidth;
        for(z = 0; z < this.mapHeight; z++) this.makeBlock(x* this.blockSize,z* this.blockSize,'./assets/textures/concrete_text.jpg');

    }

    getPlayerPosition(){
        let pos: Vector3 = new Vector3();
        pos.x =  this.mapWidth * this.blockSize * 0.5;
        pos.z =  this.mapHeight * this.blockSize * 0.5;

        return pos;
    }

    private makeBlock(x_,z_,text_){

        let mesh : Mesh = MeshBuilder.CreateBox("wall_block", {size: this.blockSize},  this.scene);
        mesh.checkCollisions = true;
        mesh.isPickable = true;
        let mat = new StandardMaterial("matGround", this.scene);
        let textureBox = new Texture(text_, this.scene);
        mat.diffuseTexture = textureBox;
        mat.diffuseTexture.scale(1/4) ;
        mesh.material = mat;

        mesh.position.x = x_;
        mesh.position.z = z_;
        mesh.position.y = this.blockSize * 0.5;

    }

    private makeCanvas(x_, y_,z_,text_){

        let canvas : Mesh = MeshBuilder.CreatePlane("canvas", {size: this.blockSize*0.8},  this.scene);
        mesh.isPickable = true;
        let mat = new StandardMaterial("matCanvas", this.scene);
        let textureCanvas = new Texture(text_, this.scene);
        mat.diffuseTexture = textureCanvas;
        canvas.material = mat;
        canvas.position.x = x_;
        canvas.position.y = y_;
        canvas.position.z = z_;
        
        return canvas;
    }

    private moveGhostMeshBox(pos_ : Vector3){
        pos_.y = pos_.y + (this.blockSize * 0.5);
        pos_.x = Math.round(pos_.x  / this.blockSize)*this.blockSize;
        pos_.z = Math.round(pos_.z  / this.blockSize)*this.blockSize;
        this.ghostMeshBox.position = pos_;
    }
  
    private moveGhostMeshPainting(pos_ : Vector3){
        pos_.y = pos_.y + (this.blockSize * 0.5);
        pos_.x = Math.round(pos_.x  / this.blockSize)*this.blockSize;
        pos_.z = Math.round(pos_.z  / this.blockSize)*this.blockSize;
        this.ghostMeshPainting.position = pos_;
    }
  
  private moveCanvasSelected(pos_ : Vector3){
        if( !this.canvasSelected ) return;
        pos_.y = pos_.y + (this.blockSize * 0.5);
        pos_.x = Math.round(pos_.x  / this.blockSize)*this.blockSize;
        pos_.z = Math.round(pos_.z  / this.blockSize)*this.blockSize;
        this.canvasSelected.position = pos_;
    }
}
