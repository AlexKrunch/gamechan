import {
    Engine, Scene, FreeCamera, Vector3, Mesh,
    StandardMaterial, Texture, HemisphericLight,
    Color4,
} from 'babylonjs'

import {GameUtils} from './game-utils'
import {Map} from './map'
import { GameUiService } from '../services/game-ui.service';

export class Game {

    //Singleton data
    private static instance: Game;
    private canvas: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;
    private map : Map;
    private camera : FreeCamera;
    private gameUtils : GameUtils;
    private gameUIService :GameUiService;

    constructor(canvasElement : string) {

        //Set the instance
        Game.instance = this;
        this.canvas = <HTMLCanvasElement> document.getElementById(canvasElement);
        this.engine = new Engine(this.canvas, true, null, false);
  
        // Listen for browser/canvas resize events
        window.addEventListener("resize", ()=> {
          this.engine.resize();
        });
        
    }

    public setUIService(service_:GameUiService){
        this.gameUIService = service_;
    }

    private playerHeight = 4; // The player eyes height
    private speed = 1;
    private inertia = 0.9;
    private angularSensibility = 1000;


    public initScene(){

        if( this.scene != null)  this.scene.dispose();
        // We need a scene to create all our geometry and babylonjs items in
        this.scene = new Scene(this.engine);
        this.scene.audioEnabled = false;

        this.map = new Map(this.scene, this.gameUIService);

        //Camera FPS
        this.camera = new FreeCamera('freeCamera', new Vector3(this.map.getPlayerStartPosition().x, 5, this.map.getPlayerStartPosition().z), this.scene);
        this.camera.attachControl(this.canvas);
        this.scene.gravity = new Vector3(0, -0.7, 0);
        this.camera.applyGravity = true;

        this.camera.ellipsoid = new Vector3(2.5, this.playerHeight, 2.5);
        this.camera.ellipsoidOffset = new Vector3(0, this.playerHeight, 0);
        this.camera.checkCollisions = true;
            
        GameUtils.setKeyBoardMapping(this);

        this.camera.speed = this.speed;
        this.camera.inertia = this.inertia;
        this.camera.angularSensibility =this.angularSensibility;

        let handleCameraUpdate = evt => {
            this.map.updateFrontBlock(this.camera)
        }
        this.camera.onViewMatrixChangedObservable.add(handleCameraUpdate);

        //Add sky
        this.scene.clearColor = new Color4(132/255,197/255,232/255, 1);

        //Add ground
        let ground: Mesh;
        ground = Mesh.CreateGround("ground", 1000, 1000, 2, this.scene);
        ground.checkCollisions = true;
        ground.position.y = - 0.1;
    
        let mat = new StandardMaterial("matVolcano", this.scene);
        let texture = new Texture("./assets/textures/volcanic_text.jpg", this.scene, true, true, BABYLON.Texture.NEAREST_NEAREST);
        mat.diffuseTexture = texture;
        ground.material = mat;

        // Hemispheric light to enlight the scene
        let hLight = new HemisphericLight("hemi", new Vector3(0, 0.5, 0), this.scene);
        hLight.intensity = 0.85;

        //Launch teh run
        this.run();

    }

    //Render process
    run() : void {
        this.engine.runRenderLoop(()=> {
        if(this.scene != null){
            this.scene.render();
        }
        });
    }

}