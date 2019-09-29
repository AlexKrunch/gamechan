import BlockModel from "../../models/block.model";

export default class BlockMesh {

    private scene : BABYLON.Scene;
    blockModel : BlockModel;
    mesh

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
        this.mesh.checkCollisions = true;

        //Block created
        console.log("created");
    }
}