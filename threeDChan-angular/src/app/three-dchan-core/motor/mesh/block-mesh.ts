import BlockModel from "../../models/block.model";
import MapEditor from "../map-editor";
const uuidv1 = require('uuid/v1');

export default class BlockMesh {

    private scene : BABYLON.Scene;
    blockModel : BlockModel;
    mesh: BABYLON.Mesh;
    material : BABYLON.StandardMaterial;

    nameId : string;

    constructor(blockModel_: BlockModel, scene_ : BABYLON.Scene, mapEditor_ : MapEditor) {

        this.blockModel = (blockModel_)? blockModel_ : new BlockModel();
        this.scene = scene_;
        this.nameId = 'block_'+uuidv1();

        //Make the mesh
        this.mesh = BABYLON.MeshBuilder.CreateBox(
            this.nameId, {
            width: this.blockModel.size.x,
            height: this.blockModel.size.y,
            depth: this.blockModel.size.z,
            },
        this.scene);
        this.mesh.checkCollisions = false;
        this.setSelected(false);

        //Block created
        console.log("created");
        mapEditor_.registrerBlock(this);
    }

    /**
     * Place the block at the point of impact
     * @param point_ 
     */
    public placeToImpact(point_: BABYLON.Vector3){
     
        this.mesh.position.x = point_.x;
        this.mesh.position.y = point_.y + this.mesh.scaling.y* 0.5;
        this.mesh.position.z = point_.z;

        //console.log(point_);

    }

    public setSelected(isSelected_: Boolean){

        this.material = new BABYLON.StandardMaterial("material_block_"+this.nameId, this.scene);
        

        if(isSelected_) {
            console.log("select_block");
            this.material.alpha = 1;
            this.material.diffuseColor = new BABYLON.Color3(1, 0, 1);
            //this.mesh.disableEdgesRendering();
        } else {
            console.log("deselect block !!!");
            this.material.diffuseColor = new BABYLON.Color3(0, 1, 1);
            /*this.material.alpha = 0;
            this.mesh.enableEdgesRendering(1-0.000000000000001);
            this.mesh.edgesWidth = 2.0;
            this.mesh.edgesColor = new BABYLON.Color4(0, 0, 1, 1);*/
        }

        this.mesh.material = this.material;
      
    }
}