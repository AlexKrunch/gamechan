import DataMeshModel from './data-mesh.model';

export default class BlockModel extends DataMeshModel{
    x: number;
    y: number;
    z: number;

    scale_x: number;
    scale_y: number;
    scale_z: number;

    rot_x: number;
    rot_y: number;
    rot_z: number;
}