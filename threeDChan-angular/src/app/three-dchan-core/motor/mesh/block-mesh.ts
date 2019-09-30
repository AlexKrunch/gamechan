import BlockModel from "../../models/block.model";

export default class BlockMesh {

    private scene : BABYLON.Scene;
    blockModel : BlockModel;
    mesh: BABYLON.Mesh;

    constructor(blockModel_: BlockModel, scene_ : BABYLON.Scene) {

        this.blockModel = (blockModel_)? blockModel_ : new BlockModel();
        this.scene = scene_;

        //Make the mesh
        this.mesh = BABYLON.MeshBuilder.CreateBox(
            "groundTile", {
            width: this.blockModel.size.x,
            height: this.blockModel.size.y,
            depth: this.blockModel.size.z,
            },
        this.scene);
        this.mesh.checkCollisions = false;

        //Block created
        console.log("created");
    }

    /**
     * Place the block at the point of impact
     * @param point_ 
     */
    public placeToImpact(point_: BABYLON.Vector3){
     
        this.mesh.position.x = point_.x;
        this.mesh.position.y = point_.y + this.mesh.scaling.y* 0.5;
        this.mesh.position.z = point_.z;

        console.log(point_);

    }
}