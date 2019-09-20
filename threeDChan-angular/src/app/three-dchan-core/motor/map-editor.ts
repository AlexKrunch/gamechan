
import {
    Engine, Scene,FreeCamera, Light,
    DirectionalLight, HemisphericLight, ShadowGenerator,
    Color4, Color3Gradient, Mesh, AbstractMesh,
    Vector3, MeshBuilder, ArcRotateCamera,
    StandardMaterial, Texture, Color3, PointLight,
} from 'babylonjs'

import MapModel from '../models/map.model';
import BlockMesh  from './mesh/block-mesh';

export default class MapEditor {

    private scene : BABYLON.Scene;
    //Dictionnary of mesh --> data slot
    public blockDict: { [id: string] : BlockMesh; } = {};

    constructor(scene_: BABYLON.Scene) {

        this.scene = scene_;
        
    }

    //create block

    //create entity

    //create character

    //point a stuff, ask what it is?
    //+select it

    //------
    //Select an object
    //Destroy
    //Duplicate
    //Modify

}