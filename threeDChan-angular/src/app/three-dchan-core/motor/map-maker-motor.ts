
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
import MapEditor from './map-editor';

export class MapMakerMotor {

    //Singleton data
    private static instance: MapMakerMotor;
    public canvas: HTMLCanvasElement;
    public engine: BABYLON.Engine;
    public scene: BABYLON.Scene;
    public camera: BABYLON.FreeCamera;

    //scene elements
    private dLight: DirectionalLight;
    private hLight: BABYLON.HemisphericLight;
    private pLight: PointLight;
    public shadowGen: ShadowGenerator;
    private ground: Mesh;

    //Other
    private mapEditor: MapEditor;

    constructor(canvasElement : string) {

        //Set the instance
        MapMakerMotor.instance = this;
        this.canvas = <HTMLCanvasElement> document.getElementById(canvasElement);
        this.engine = new BABYLON.Engine(this.canvas, true, null, false);
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

      this.mapEditor = new MapEditor(this.scene);
      this.mapEditor.initMap();
  
    }

    createScene() {

        console.log("createScene()");
        // We need a scene to create all our geometry and babylonjs items in
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.FreeCamera("fly_cam", new BABYLON.Vector3(0, 5, -10), this.scene);

          // This targets the camera to scene origin
          this.camera.setTarget(BABYLON.Vector3.Zero());

          // This attaches the camera to the canvas
          this.camera.attachControl(this.canvas, true);
  
          // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
          this.hLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
          // Default intensity is 1. Let's dim the light a small amount
          this.hLight.intensity = 0.7;
  
          // Our built-in 'sphere' shape.
          //var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, this.scene);
          var pointerDragBehaviorX = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0,1,0)});
          pointerDragBehaviorX.useObjectOrienationForDragging = false;

          // Listen to drag events
          /*
          pointerDragBehaviorX.onDragStartObservable.add((event)=>{
              console.log("dragStart");
              console.log(event);
          })
          pointerDragBehaviorX.onDragObservable.add((event)=>{
              console.log("drag");
              console.log(event);
          })
          pointerDragBehaviorX.onDragEndObservable.add((event)=>{
              console.log("dragEnd");
              console.log(event);
          })
          sphere.addBehavior(pointerDragBehaviorX);
          // Move the sphere upward 1/2 its height
          sphere.position.y = 1;
          */


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
        //this.scene.autoClear = false; // Color buffer
        //this.scene.autoClearDepthAndStencil = false;


        /*
        // Hemispheric light to enlight the scene
        this.hLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 0.5, 0), this.scene);
        this.hLight.intensity = 0.85;
    
        //texture
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

      /* INTERACTIONS */
      public addMesh(){
        //this.mapEditor.addBlock();
      }

      public onClick(){
        this.mapEditor.onClick();
      }

}