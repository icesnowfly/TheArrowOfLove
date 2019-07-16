/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function MyGame() {
    this.kTexture = "assets/kTexture.png";
    this.kWood = "assets/RigidShape/Wood.png";
    this.kBoy = "assets/boy.png";
    this.kGirl = "assets/girl.png";

    // The camera to view the scene
    this.mCamera = null;
}
gEngine.Core.inheritPrototype(MyGame, Scene);


MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kTexture);
    gEngine.Textures.loadTexture(this.kWood);
    gEngine.Textures.loadTexture(this.kBoy);
    gEngine.Textures.loadTexture(this.kGirl);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(this.kTexture);
    gEngine.Textures.unloadTexture(this.kWood);
    gEngine.Textures.unloadTexture(this.kBoy);
    gEngine.Textures.unloadTexture(this.kGirl);
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(100, 75), // position of the camera
        200,                     // width of camera
        [0, 0, 800, 600]         // viewport (orgX, orgY, width, height)
    );
    this.mCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
    gEngine.DefaultResources.setGlobalAmbientIntensity(3);

    //Set up the Cupid
    this.mCupid = new Cupid(this.kTexture);
    //Set up the platforms
    this.mPlatformSet = new PlatformSet();
    this.mPlatformSet.addToSet(new Platform(this.kWood,50,20,100,10));
    this.mPlatformSet.addToSet(new Platform(this.kWood,50,90,100,10));
    this.mPlatformSet.addToSet(new Platform(this.kWood,150,20,50,10,true,20,80,0.2));
    //Set up the boy and the girl
    this.mBoy = new Role(this.kBoy,25,50);
    this.mGirl = new Role(this.kGirl,25,120);

    this.mWorld = new World(this.mCupid,this.mPlatformSet,this.mBoy,this.mGirl);

    // Set up the message
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([1, 1, 1, 1]);
    this.mMsg.getXform().setPosition(5, 10);
    this.mMsg.setTextHeight(5);
    
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.mCamera.setupViewProjection();
    this.mWorld.draw(this.mCamera);
    this.mMsg.draw(this.mCamera);
};

MyGame.prototype.update = function () {
    //Update all the things in the scene
    if (!this.mWorld.mIsWin) {
        var msg = "   Charge: " + (this.mCupid.mSpeedCount < 100 ? this.mCupid.mSpeedCount : 100);
        this.mMsg.setText(msg);
    }
        this.mWorld.update(this.mCamera, this.mMsg);
};