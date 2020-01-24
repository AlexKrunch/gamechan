import { Scene, StandardMaterial, Mesh, MeshBuilder, Texture, Vector3, Color3, Color4 } from "babylonjs";
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
    set tool(tool_){
      this.currentTool = new ToolModel(tool_,null,null);
      let inter: InteractionModel = new InteractionModel();
      inter.type =  InteractionModel.TYPE_TOOL;
      inter.value =  this.currentTool;
      this.gameUiService.changeTool( inter );
    }
  
  
  
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
          
          if(this.currentTool.type === Map.CANVAS_ADD){
            this.makeCanvas(Vector3.Zero.x, Vector3.Zero.y, Vector3.Zero.z,null, this.currentTool.property);
            this.mode = Map.EDITION_MODE.CANVAS_DRAG;
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
        let matGhostBox : StandardMaterial = new StandardMaterial("matGhostBox_text", this.scene);
        matGhostBox.emissiveColor = new Color3(0,1,0);
        matGhostBox.alpha = 0.4;
        this.ghostMeshBuilding.material = matGhostBox;

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
                  if(pickResult.pickedMesh.name.indexOf('wall')>-1) this.moveGhostMeshPainting(pickResult.pickedMesh.position);
               } else if(this.currentTool.type === Map.EDITION_MODE.TEXTURE_ADD){
                 //IF DRAG CANVAS
                 if(pickResult.pickedMesh.name.indexOf('wall')>-1) this.moveCanvasSelected(pickResult.pickedPoint);
               }
              
           }
        };

        this.scene.onPointerUp = (evt, pickResult) => {
            if(pickResult.hit){
              if(this.currentTool.type === Map.EDITION_MODE.BLOCK_ADD){
                if(pickResult.pickedMesh.name.indexOf('ground')>-1){
                  this.makeBlock(this.ghostMeshBuilding.position.x, this.ghostMeshBuilding.position.z,'./assets/textures/concrete_text.jpg');
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
             /*
             //NO NEED TO FOR it, to suppress
             } else if(this.currentTool.type === Map.EDITION_MODE.CANVAS_ADD){
                  if(pickResult.pickedMesh.name.indexOf('wall')>-1){
                    this.canvasSelected = this.makeCanvas(pickResult.pickedPoint.x, pickResult.pickedPoint.y, pickResult.pickedPoint.z, "https://pbs.twimg.com/media/EOklPtoX4AAkQ_z?format=jpg&name=small");
                    this.currentTool.type = Map.EDITION_MODE.CANVAS_DRAG;
                  }*/
              } else if(this.currentTool.type === Map.EDITION_MODE.CANVAS_DRAG){
                 this.canvasSelected = null;
                 this.mode = Map.EDITION_MODE.SELECT;
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
      
        let mat = new BABYLON.StandardMaterial("", this.scene);
	      mat.diffuseTexture = new BABYLON.Texture("https://i.imgur.com/4cHDPDV.jpg", this.scene);
        let pat = BABYLON.Mesh.FLIP_N_ROTATE_ROW;

        let columns = 6;  // 6 columns
        let rows = 1;  // 4 rows

        let faceUV = new Array(6);

        for (var i = 0; i < 6; i++) {
            faceUV[i] = new BABYLON.Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
        }
	
        //Good example here
        //https://www.babylonjs-playground.com/#Z5JFSM#3
        let options = {
          sideOrientation: BABYLON.Mesh.DOUBLESIDE,
          pattern: pat,
          faceUV: faceUV,
          width:  this.blockSize,
          height:  this.blockSize,
          depth:  this.blockSize,
          tileSize: 1,
          tileWidth:1
        }
	
        let mesh : Mesh = MeshBuilder.CreateTiledBox("tiled_box", {size: this.blockSize},  this.scene);
        mesh.checkCollisions = true;
        mesh.isPickable = true;
        mesh.material = mat;
        mesh.position.x = x_;
        mesh.position.z = z_;
        mesh.position.y = this.blockSize * 0.5;

    }

    private makeCanvas(x_, y_,z_,text_,blob_){

        let canvas : Mesh = MeshBuilder.CreatePlane("canvas", {size: this.blockSize*0.8},  this.scene);
        canvas.isPickable = true;
        let mat = new StandardMaterial("matCanvas", this.scene);
        let textureCanvas = new Texture(text_, this.scene, false, false, false,Texture.NEAREST_SAMPLINGMODE, null,null, blob_ );
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
        this.ghostMeshBuilding.position = pos_;
    }
  
    private moveGhostMeshPainting(pos_ : Vector3){
        pos_.y = pos_.y;
        pos_.x = pos_.x;
        pos_.z = pos_.z;
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
