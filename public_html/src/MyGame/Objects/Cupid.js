//The Character : Cupid

function Cupid(spriteTexture, aCamera, x, y) {
    var w=10;
    var h=16;
    this.mBowOffset = 10;
    this.kEnergyBar = "assets/EnergyBar.png";

    this.mCH = h/2;
    this.mCupid = new SpriteAnimateRenderable(spriteTexture);
    this.mCupid.setColor([1,1,1,0]);
    this.mCupid.getXform().setPosition(x,y);
    this.mCupid.getXform().setSize(w,h);
    this.mCupid.setElementPixelPositions(0,277,0,445);

    this.mArrowSet = new ArrowSet(spriteTexture);
    this.kTexture = spriteTexture;
    this.mCamera = aCamera;
    this.mDirection = 1;

    this.mCrosshair = new Crosshair(spriteTexture,aCamera);
    this.mBow = new Bow(spriteTexture,aCamera,this.mCupid, this.mBowOffset);
    this.mBar = new EnergyBar(this.kEnergyBar,this.mCrosshair.getXform());
    this.mBarVisible = false;

    this.mG = -0.1;
    this.mf = -0.1;
    this.mSpeedX = 0;
    this.mSpeedY = 0;
    this.mCanRight = true;
    this.mCanLeft = true;

    this.kDelta = 0.01;
    this.mSpeedCount = 0;
    this.mIsInAir = true;

    GameObject.call(this,this.mCupid);

    // this.mRigidBody = new RigidRectangle(this.mCupid.getXform(),w,h);
    // this.mRigidBody.setRestitution(0);
    // this.setRigidBody(this.mRigidBody);
    // this.mRigidBody.setRestitution(0);
    // this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Cupid,GameObject);

Cupid.prototype.draw = function(aCamera){
    this.mCupid.draw(aCamera);
    this.mBow.draw(aCamera);
    this.mCrosshair.draw(aCamera);
    this.mArrowSet.draw(aCamera);
    this.mBar.draw(aCamera);
}

Cupid.prototype.update = function(World){

    //Get the references
    var xform = this.getXform();
    var PlatformSet = World.mPlatformSet;

    //Reset the Cupid's position
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.R))
    {
        xform.setPosition(60,50);
        this.mSpeedX = 0;
        this.mSpeedY = 0;
    }

    //Move Left and Right
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A) && this.mCanLeft)
    {
        this.mSpeedX = -1;
        this.mCupid.setElementPixelPositions(277,0,0,445);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D) && this.mCanRight)
    {
        this.mSpeedX = 1;
        this.mCupid.setElementPixelPositions(0,277,0,445);
    }
    //Update the speed of Y-axis
    this.mSpeedY += this.mG;

    //Jump
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space) && !this.mIsInAir)
    {
        this.mSpeedY = 2.5;
        this.mIsInAir = true;
    }
    //Update the Cupid's position
    xform.incXPosBy(this.mSpeedX);
    xform.incYPosBy(this.mSpeedY);

    //Update the Crosshair position
    this.mCrosshair.update();

    //Update the Bow's position and rotation
    var vx = this.mCamera.mouseWCX()- xform.getXPos();
    var vy = this.mCamera.mouseWCY()-xform.getYPos();
    if (vx>0) //get the Bow's direction
        this.mDirection = 1;
    else this.mDirection = -1;
    var radian = Math.atan2(vy,vx);
    var cosT = Math.cos(radian);
    var sinT = Math.sin(radian);
    this.mBow.update(radian,cosT,sinT);

    //Recover the Left/Right movement
    this.mCanLeft = true;
    this.mCanRight = true;
    //Deal with the collision
    for (var i = 0; i < PlatformSet.size(); i++) {
        var status = this.getBBox().enterCollideStatus(PlatformSet.getObjectAt(i).getBBox());
        if (status === 1) {
            xform.setYPos(PlatformSet.getObjectAt(i).getBBox().maxY() + this.mCH);
            this.mSpeedY = 0;
            this.mIsInAir = false;
            if (this.mSpeedX > 0) {
                this.mSpeedX += this.mf;
                if (this.mSpeedX < 0)
                    this.mSpeedX = 0;
            } else {
                this.mSpeedX -= this.mf;
                if (this.mSpeedX > 0)
                    this.mSpeedX = 0;
            }
        }
        if (status === 2) {
            xform.setYPos(PlatformSet.getObjectAt(i).getBBox().minY() - this.mCH);
            this.mSpeedY = -this.mSpeedY;
        }
        if (status === 3) {
            this.mCanRight = false;
            this.mSpeedX = 0;
        }
        if (status === 4){
            this.mCanLeft = false;
            this.mSpeedX = 0;
        }
    }
    //Use WASD to control the Cupid's movement

    // if (this.mRigidBody.mVelocity[1]>-0.0001 && this.mOldVelocityY<-1)
    //     this.mIsInAir = false;
    // this.mOldVelocityY = this.mRigidBody.mVelocity[1];

    // if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    // {
    //     //xform.incXPosBy(this.kDelta);
    //     this.mRigidBody.addVelocity(5,0);
    //     if (this.mRigidBody.mVelocity[0]>50)
    //         this.mRigidBody.mVelocity[0]=50;
    //     this.mCupid.setElementPixelPositions(0,277,0,445);
    // }
    // if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
    // {
    //    //xform.incXPosBy(-this.kDelta);
    //     this.mRigidBody.addVelocity(-5,0);
    //     if (this.mRigidBody.mVelocity[0]<-50)
    //         this.mRigidBody.mVelocity[0]=-50;
    //     this.mCupid.setElementPixelPositions(277,0,0,445);
    // }
    // if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space) && !this.mIsInAir)
    // {
    //     this.mRigidBody.setVelocity(this.mRigidBody.mVelocity[0], 120);
    //     this.mIsInAir = true;
    //     this.mJumpTimer = 0;
    // }
    // if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
    // {
    //     xform.incYPosBy(-this.kDelta);
    // }
    //
    // if (this.mIsInAir = true)
    // {
    //     this.mJumpTimer += 1;
    // }
    //
    // if (this.mJumpTimer > 10) {
    //     var PlatformSet = World.mPlatformSet;
    //     for (var i = 0; i < PlatformSet.size(); i++) {
    //         if ((this.getBBox().minY() - 1 < PlatformSet.getObjectAt(i).getBBox().maxY())
    //             && (this.getBBox().maxY() > PlatformSet.getObjectAt(i).getBBox().maxY())
    //             && (this.getBBox().maxX() < PlatformSet.getObjectAt(i).getBBox().maxX())
    //             && (this.getBBox().minX() > PlatformSet.getObjectAt(i).getBBox().minX())) {
    //             this.mIsInAir = false;
    //         }
    //     }
    // }

    //Use mouse to control the arrow's direction
    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left))
    {
        if (this.mSpeedCount < 100) {
            this.mSpeedCount += 1;
            this.mCrosshair.setColor([this.mSpeedCount/100, 0, 0, 1]);
        }
        this.mBarVisible = true;
    }

    if (gEngine.Input.isButtonReleased(gEngine.Input.mouseButton.Left))
    {
        if (this.mSpeedCount > 10) {
            // if (this.mSpeedCount > 100)
            //     this.mSpeedCount = 100;
            var arrow = new Arrow(this.kTexture, this, cosT, sinT, this.mSpeedCount * 3);
            this.mArrowSet.addToSet(arrow);
        }
        this.mSpeedCount = 0;
        this.mCrosshair.setColor([0,0,0,1]);
        this.mBarVisible = false;
    }

    //Update the EnergyBar
    this.mBar.update(this.mSpeedCount, this.mBarVisible);

    if (this.mDirection>0) {
        this.mCupid.setElementPixelPositions(0, 277, 0, 445);
    } else {
        this.mCupid.setElementPixelPositions(277, 0, 0, 445);
    }

    GameObject.prototype.update.call(this);
    this.mArrowSet.update(World);

}