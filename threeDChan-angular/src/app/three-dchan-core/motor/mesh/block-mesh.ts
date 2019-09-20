import BlockModel from "../../models/block.model";

export default class BlockMesh {

    private scene : BABYLON.Scene;
    blockModel : BlockModel;

    constructor(blockModel_: BlockModel, scene_ : BABYLON.Scene) {

        this.blockModel = blockModel_;
        this.scene = scene_;

        //Make the mesh
    }
}