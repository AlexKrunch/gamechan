import { Scene, StandardMaterial, Mesh, MeshBuilder, Texture, Vector3, Color3, Camera, Ray } from "babylonjs";
import { GameUiService } from '../services/game-ui.service';
import ToolModel from '../models/tool.model';
import InteractionModel from '../models/interaction.model';

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

    private BLOCK_TEXTURE = '/assets/textures/craft_text.png'; 
    
    private currentTool = new ToolModel(Map.EDITION_MODE.SELECT, null, null) ;
    set mode(mode_){
      this.currentTool = new ToolModel(mode_,null,null);
      let inter: InteractionModel = new InteractionModel();
      inter.type =  InteractionModel.TYPE_TOOL;
      inter.value =  this.currentTool;
      this.gameUIService.changeTool( inter );
    }
  
  
  
    private gameUIService : GameUiService;

    private scene: Scene;
    private mapData: number[];
    private mapWidth: number = 16;
    private mapHeight: number = 17;
    private blockSize: number = 8;

    private ghostMeshPainting: Mesh; //mesh to display to impact point
    private ghostMeshBuilding: Mesh;
    private canvasSelected: Mesh;

    private meshArray:any[] = new Array();


    constructor(scene_, service_: GameUiService){

        this.scene = scene_;

        this.gameUIService = service_;
        /*
        this.gameUIService.changeEditorToolEmitter.subscribe(interaction_ => {
          
            this.currentTool = interaction_.value;
            console.log(this.currentTool);
            console.log(Map.EDITION_MODE.CANVAS_ADD);
            //this.canvasSelected = null;
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
          
          if(this.currentTool.type === Map.EDITION_MODE.CANVAS_ADD){
            //this.canvasSelected = this.makeCanvas(Vector3.Zero().x, Vector3.Zero().y, Vector3.Zero().z,'https://66.media.tumblr.com/00d47c03c731d331be47685171d974a2/de62c0774c395559-f8/s540x810/c02caa4fc9aaca381faa21afd9ed4e4d0abdf85b.jpg', null);
            //this.canvasSelected = this.makeCanvas(Vector3.Zero().x, Vector3.Zero().y, Vector3.Zero().z, null, this.currentTool.property);
            this.canvasSelected = this.makeCanvas(Vector3.Zero().x, Vector3.Zero().y, Vector3.Zero().z, this.currentTool.property, null);
            this.mode = Map.EDITION_MODE.CANVAS_DRAG;
          }
        });*/

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
        /*
        let matGhostBox : StandardMaterial = new StandardMaterial("matGhostBox_text", this.scene);
        matGhostBox.emissiveColor = new Color3(0,1,0);
        matGhostBox.alpha = 0.4;
        this.ghostMeshBuilding.material = matGhostBox;*/

        this.ghostMeshBuilding.material = matGhost;

        /*
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
               } else if(this.currentTool.type === Map.EDITION_MODE.CANVAS_DRAG){

                 //IF DRAG CANVAS
                 if(pickResult.pickedMesh.name.indexOf('wall')>-1) this.moveCanvasSelected(pickResult.pickedPoint, pickResult.pickedMesh as Mesh);
               }
              
           }
        };

        this.scene.onPointerUp = (evt, pickResult) => {
            if(pickResult.hit){
              if(this.currentTool.type === Map.EDITION_MODE.BLOCK_ADD){
                if(pickResult.pickedMesh.name.indexOf('ground')>-1){
                  this.makeBlock(this.ghostMeshBuilding.position.x, this.ghostMeshBuilding.position.z,this.BLOCK_TEXTURE);
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

              } else if(this.currentTool.type === Map.EDITION_MODE.CANVAS_DRAG){
                //this.canvasSelected = null;
                //this.mode = Map.EDITION_MODE.SELECT;
              }
              
            }
         };*/

    }

    private displayMap(){

        let x = 0;
        let z = 0;
        //Create the walls
        //N
        for(x = 0; x < this.mapWidth; x++) this.makeBlock(x* this.blockSize,z* this.blockSize,this.BLOCK_TEXTURE);

        z =  this.mapHeight;
        for(x = 0; x < this.mapWidth; x++) this.makeBlock(x* this.blockSize,z* this.blockSize,this.BLOCK_TEXTURE);

        x = 0;
        for(z = 0; z < this.mapHeight; z++) this.makeBlock(x* this.blockSize,z* this.blockSize,this.BLOCK_TEXTURE);

        x = this.mapWidth;
        for(z = 0; z < this.mapHeight; z++) this.makeBlock(x* this.blockSize,z* this.blockSize,this.BLOCK_TEXTURE);

    }

    /**
     * Method to get the first player position (at the middle of the map)
     */
    getPlayerStartPosition(){
        let pos: Vector3 = new Vector3();
        pos.x =  this.mapWidth * this.blockSize * 0.5;
        pos.z =  this.mapHeight * this.blockSize * 0.5;
        return pos;
    }

    /**
     * Get the block in front of you
     */

    private updateFrontBlockTimer: number = 0;
    private UPDATE_FRONT_BLOCK: number = 60;
    public updateFrontBlock(cam_ : Camera){

        this.updateFrontBlockTimer --;
        if(this.updateFrontBlockTimer > 0) return;
        let pos : Vector3  = cam_.position;
        let ray: Vector3 = cam_.getForwardRay().direction;
        ray = ray.multiply(new Vector3(this.blockSize*2, 0, this.blockSize*2) );
        let selectPos: Vector3 = pos.add(ray);
        selectPos.y = 0;

        //update the ghost mesh
        this.moveGhostMeshBox(selectPos);
        this.updateFrontBlockTimer = this.UPDATE_FRONT_BLOCK;
    }

    /**
     * Get/Select the block you click on
     */
    private getClickedBlock(){

    }

    private makeBlock(x_,z_,text_){
      
      //Doc of UV is here
      //https://doc.babylonjs.com/how_to/createbox_per_face_textures_and_colors

        let mat = new StandardMaterial("", this.scene);
	      mat.diffuseTexture = new Texture(text_, this.scene, true, true, BABYLON.Texture.NEAREST_NEAREST);
        let columns = 24;  // 6 columns
        let rows = 87;  // 4 rows
        let faceUV = new Array(6);
        for (var i = 0; i < 6; i++) {
          
          //Use now the top left sprite.
          let Ubottom_left = i / columns;
          let Vbottom_left = 1-(1/rows);
          let Utop_right = (i + 1) / columns;
          let Vtop_right = 1;

          //console.log('bottomx'+Ubottom_left+' bottomy'+Vbottom_left+' topx'+Utop_right+' topy'+Vtop_right)
          faceUV[i] = new BABYLON.Vector4(Ubottom_left, Vbottom_left, Utop_right, Vtop_right);
        }
        let options = {
          faceUV: faceUV,
          width:  this.blockSize,
          height: this.blockSize,
          depth:  this.blockSize,
          wrap: true,
        }
        //https://playground.babylonjs.com/#NLWBJP#8
	
        let mesh : Mesh = MeshBuilder.CreateBox("wall_box_"+this.meshArray.length, options,  this.scene);
        mesh.checkCollisions = false;
        mesh.isPickable = true;
        mesh.material = mat;
        mesh.position.x = x_;
        mesh.position.z = z_;
        mesh.position.y = this.blockSize * 0.5;
        this.meshArray.push(mesh);
        return mesh;
    }

    private makeCanvas(x_, y_,z_,text_,blob_){
        let canvas : Mesh = MeshBuilder.CreatePlane("canvas", {size: this.blockSize*0.8},  this.scene);
        canvas.isPickable = false;
        canvas.checkCollisions = false;

        let mat = new StandardMaterial("matCanvas", this.scene);
        let textureCanvas = new Texture(text_, this.scene, false, false,Texture.NEAREST_SAMPLINGMODE, null,null, blob_ );
        mat.diffuseTexture = textureCanvas;
        canvas.material = mat;
        canvas.position.x = x_;
        canvas.position.y = y_;
        canvas.position.z = z_;
        canvas.rotation.z = 180 *(Math.PI/180);
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
  
  private moveCanvasSelected(pos_ : Vector3, block_: Mesh){
        if( !this.canvasSelected ) return;
        
        pos_.y = pos_.y;
        pos_.x = pos_.x;
        pos_.z = pos_.z;
    
        //Get the rotation  of the canvas
        let wBlock = this.blockSize;
        let dBlock = this.blockSize;
        let gap = 0.2 //Gap between the canvas and the block;
       
        if( pos_.z >= dBlock *0.49 + block_.position.z
          && pos_.x > -wBlock *0.5 + block_.position.x
          && pos_.x < wBlock *0.5 + block_.position.x ){
          //N
          pos_.z += gap;
          this.canvasSelected.rotation.y =  180 *(Math.PI/180);
          console.log("N")
        } else if( pos_.x >= wBlock *0.49 + block_.position.x
          && pos_.z > -dBlock *0.5 + block_.position.z
          && pos_.z < dBlock *0.5 + block_.position.z ){
          //E
          pos_.x += gap;
          this.canvasSelected.rotation.y =  270 *(Math.PI/180);
          console.log("E")
        }else if( pos_.z <= -dBlock *0.49 + block_.position.z
          && pos_.x > -wBlock *0.5 + block_.position.x
          && pos_.x < wBlock *0.5 + block_.position.x ){
          //S
          pos_.z -= gap;
          this.canvasSelected.rotation.y = 0;
          console.log("S")
        } else if( pos_.x <= -wBlock *0.49 + block_.position.x
          && pos_.z > -dBlock *0.5 + block_.position.z
          && pos_.z < dBlock *0.5 + block_.position.z ){
          //W
          pos_.x-= gap;
          this.canvasSelected.rotation.y = 90 *(Math.PI/180);
          console.log("W")
        } else {
          console.log("None")
        }
     
        this.canvasSelected.position = pos_;
        //console.log(this.canvasSelected.position)
    }
}
