import BlockModel from "../../models/block.model";
import MapEditor from "../map-editor";

//import uuidv1 from 'uuid/v1';
import * as uuid from 'uuid';

export default class BlockMesh {

    private scene : BABYLON.Scene;
    blockModel : BlockModel;
    mesh: BABYLON.Mesh;
    material : BABYLON.StandardMaterial;

    constructor(blockModel_: BlockModel, scene_ : BABYLON.Scene, mapEditor_ : MapEditor) {

        this.blockModel = (blockModel_)? blockModel_ : new BlockModel();
        this.scene = scene_;
        this.blockModel.nameId = 'block_'+uuid.v1();
        this.makeBlockMesh();
        this.setSelected(false);

        //Block created
        console.log("created");
        mapEditor_.registrerBlock(this);
    }

    /**
     * Place the block at the point of impact
     * @param point_ 
     */
    /*
    public placeToImpact(point_: BABYLON.Vector3){
     
        this.mesh.position.x = point_.x;
        this.mesh.position.y = point_.y + this.mesh.scaling.y* 0.5;
        this.mesh.position.z = point_.z;
        //console.log(point_);

    }*/

    public setSelected(isSelected_: Boolean){

        //https://www.html5gamedevs.com/topic/33483-how-switch-material-by-button-click/
        if(!this.mesh.material){
            this.mesh.material = new BABYLON.StandardMaterial("material_block"+uuid.v1(), this.scene);
        }
        
        if(!isSelected_) {
            console.log("select_block");
            //this.mesh.material.alpha = 1;
            (this.mesh.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(1, 0, 1);
            this.mesh.material.wireframe = true;
            //this.mesh.disableEdgesRendering();
        } else {
            console.log("deselect block !!!");
            (this.mesh.material as BABYLON.StandardMaterial).diffuseColor = new BABYLON.Color3(0, 1, 1);
            this.mesh.material.wireframe = false;
            /*this.material.alpha = 0;
            this.mesh.enableEdgesRendering(1-0.000000000000001);
            this.mesh.edgesWidth = 2.0;
            this.mesh.edgesColor = new BABYLON.Color4(0, 0, 1, 1);*/
        }
      
    }

    editMesh(blockModel_: BlockModel){
        console
        this.mesh.rotation.y = blockModel_.rotation.y;
        this.blockModel = blockModel_;
        this.makeBlockMesh();
        this.setSelected(true);
    }

    updateMeshPosition(){

        this.blockModel.position.x = this.mesh.position.x;
        this.blockModel.position.y = this.mesh.position.y;
        this.blockModel.position.z = this.mesh.position.z;
        
    }

    makeBlockMesh(){

        if( this.mesh )  this.mesh.dispose();

        //Make the mesh
        this.mesh = BABYLON.MeshBuilder.CreateBox(
            this.blockModel.nameId, {
            width: this.blockModel.size.x,
            height: this.blockModel.size.y,
            depth: this.blockModel.size.z,
            },
        this.scene);

        //Rotation and position
        this.mesh.rotation.y =  this.blockModel .rotation.y;
        this.mesh.position.x =  this.blockModel .position.x;
        this.mesh.position.y =  this.blockModel .pointOfImpact + this.mesh.scaling.y* 0.5;
        this.mesh.position.z =  this.blockModel .position.z;
        this.mesh.checkCollisions = false;
    }

    public destroy(){
        this.mesh.dispose();
    }
}