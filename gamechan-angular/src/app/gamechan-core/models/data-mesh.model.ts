import VectorModel from './vector.model';
/*
All elements from the map inherit from it
*/

export default class DataMeshModel{
    nameId: string = "";
    pointOfImpact: number = 0; //Ref for the editor when scaling the height of the mesh
    position: VectorModel = new VectorModel(0,0,0);
    size: VectorModel = new VectorModel(1,1,1);
    scale: VectorModel = new VectorModel(1,1,1);
    rotation: VectorModel = new VectorModel(0,0,0);
    
}