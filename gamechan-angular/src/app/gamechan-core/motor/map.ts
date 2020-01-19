import { Scene, StandardMaterial, Mesh, MeshBuilder, Texture, Vector3 } from "babylonjs";

export class Map {

    private scene: Scene;
    private mapData: number[];
    private mapWidth: number = 6;
    private mapHeight: number = 7;
    private blockSize: number = 8;

    private ghostMesh: Mesh; //mesh to display to impact point


    constructor(scene_){
        this.scene = scene_;
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

        //init hte ghost mesh
        this.ghostMesh = MeshBuilder.CreateBox("ghost_tile", {size: this.blockSize},  this.scene);
        this.ghostMesh.isPickable = false;
        //Add wireframe texture
        let matGhost : StandardMaterial = new StandardMaterial("matGround", this.scene);
        matGhost.wireframe = true;
        this.ghostMesh.material = matGhost;

        //prepare the pointer
        this.scene.pointerMovePredicate = function(mesh) {
            return mesh.isPickable;
        }

        this.scene.pointerUpPredicate = function(mesh) {
            return mesh.isPickable;
        }
    
        //When pointer down event is raised
        this.scene.onPointerMove = (evt, pickResult) => {
           if(pickResult.hit){
                //console.log(pickResult.pickedMesh.name);
                if(pickResult.pickedMesh.name.indexOf('ground')>-1) this.moveGhostMesh(pickResult.pickedPoint);
           }
        };

        this.scene.onPointerUp = (evt, pickResult) => {
            if(pickResult.hit){
                 console.log("Make block");
                 if(pickResult.pickedMesh.name.indexOf('ground')>-1){

                    this.makeBlock(pickResult.pickedPoint.x,pickResult.pickedPoint.z,'./assets/textures/concrete_text.jpg');

                 } else if(pickResult.pickedMesh.name.indexOf('wall')>-1){
                    let mesh = pickResult.pickedMesh;

                    let mat = new StandardMaterial("matGround", this.scene);
                    //let textureBox = new Texture('https://pbs.twimg.com/media/EOoDty5XkAANDcZ?format=jpg&name=small', this.scene);
                    let textureBox = new Texture('https://pbs.twimg.com/media/EOpI7_3WsAA1hkU?format=jpg&name=360x360', this.scene);
                    mat.diffuseTexture = textureBox;
                    mat.diffuseTexture.scale(1/4) ;
                    mesh.material = mat;
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

        let mesh : Mesh = MeshBuilder.CreateBox("wall_tile", {size: this.blockSize},  this.scene);
        //mesh.checkCollisions = true;
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

    private moveGhostMesh(pos_ : Vector3){
        pos_.y = pos_.y + (this.blockSize * 0.5);
        pos_.x = Math.round(pos_.x  / this.blockSize)*this.blockSize;
        pos_.z = Math.round(pos_.z  / this.blockSize)*this.blockSize;
        this.ghostMesh.position = pos_;
    }
}