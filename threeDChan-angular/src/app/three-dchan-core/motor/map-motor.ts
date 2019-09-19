
import {
    Engine, Scene,FreeCamera, Light,
    DirectionalLight, HemisphericLight, ShadowGenerator,
    Color4, Color3Gradient, Mesh, AbstractMesh,
    Vector3, MeshBuilder, ArcRotateCamera,
    StandardMaterial, Texture, Color3, PointLight,
} from 'babylonjs'
  
import * as GUI from 'babylonjs-gui';
  
import {
    GradientMaterial
}from 'babylonjs-materials'

export class MapMotor {

    //Singleton data
    private static instance: MapMotor;
    public canvas: HTMLCanvasElement;
    public engine: Engine;
    public scene: Scene;
    public camera: FreeCamera;

    //scene elements
    private dLight: DirectionalLight;
    private hLight: HemisphericLight;
    private pLight: PointLight;
    public shadowGen: ShadowGenerator;
    private ground: Mesh;

    constructor(canvasElement : string) {

        //Set the instance
        MapMotor.instance = this;
        this.canvas = <HTMLCanvasElement> document.getElementById(canvasElement);
        this.engine = new Engine(this.canvas, true, null, false);
        // Listen for browser/canvas resize events
        window.addEventListener("resize", ()=> {
          this.engine.resize();
        });
        
    }

    initGame() {

      console.log( "initGame() ");
      //Launch the game
      this.createScene();
      this.run();
  
    }

    createScene() {

        console.log("createScene()");
        // We need a scene to create all our geometry and babylonjs items in
        this.scene = new Scene(this.engine);
        new FreeCamera('FlyCamera', new Vector3(0, 5,-10), this.scene);
        this.initAtmosphere();
        this.initOptimisation();
         
    }
    
      /************************
      * SCENE VISUAL STUFF
      * ligth / optimization / ground / skybox
      * and other shit
      ***********************/
    
      initAtmosphere(){
    
        //Scene atmoshpere
        this.scene.clearColor = new Color4(226/255, 244/255, 1);
        this.scene.ambientColor = new Color3(0.3, 0.3, 0.3);
    
        this.scene.autoClear = false; // Color buffer
        this.scene.autoClearDepthAndStencil = false;
    
    
        // Hemispheric light to enlight the scene
        this.hLight = new HemisphericLight("hemi", new Vector3(0, 0.5, 0), this.scene);
        this.hLight.intensity = 0.85;
    
        //texture
        /*
        this.ground = Mesh.CreateGround("ground", 1000, 1000, 2, this.scene);
        this.ground.checkCollisions = true;
        this.ground.position.y = - 0.1;
    
        let mat = new StandardMaterial("matVolcano", this.scene);
        let texture = new Texture("./assets/textures/volcanic_text.jpg", this.scene);
        mat.diffuseTexture = texture;
        this.ground.material = mat;*/
      }
    
     private shadowGenerator: BABYLON.ShadowGenerator;
    
     public setShadow(mesh_ : Mesh){
       /*
        if(this.shadowGenerator == null){
          this.shadowGenerator = new BABYLON.ShadowGenerator(256, this.pLight);
          //this.shadowGenerator.useBlurExponentialShadowMap = true;
          this.shadowGenerator.filteringQuality = BABYLON.ShadowGenerator.QUALITY_LOW;
        }
    
        this.shadowGenerator.getShadowMap().renderList.push(mesh_);
        mesh_.receiveShadows = true;*/
     }
    
      initOptimisation(){
         //Optimization
         this.scene.blockMaterialDirtyMechanism = true;
        /*
         BABYLON.SceneOptimizer.OptimizeAsync(this.scene, BABYLON.SceneOptimizerOptions.LowDegradationAllowed(),
         ()=> {
           // On success
         }, ()=> {
           // FPS target not reached
         });*/
      }
    
      //Render process
      run() : void {
        this.engine.runRenderLoop(()=> {
          if(this.scene != null){
            this.scene.render();
            //SCript to render interactions
          }
        });
      }

}