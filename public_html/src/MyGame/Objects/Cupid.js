//The Character : Cupid

function Cupid(spriteTexture) {
    var w=10;
    var h=16;

    this.mCupid = new SpriteAnimateRenderable(spriteTexture);
    this.mCupid.setColor([1,1,1,0]);
    this.mCupid.getXform().setPosition(60,50);
    this.mCupid.getXform().setSize(w,h);
    this.mCupid.setElementPixelPositions(0,277,0,445);
    this.mArrowSet = new ArrowSet(spriteTexture);
    this.kTexture = spriteTexture;

    this.kDelta = 1;
    this.mSpeedCount = 0;
    this.mIsInAir = false;
    this.mJumpTimer = 0;

    GameObject.call(this,this.mCupid);

    this.mRigidBody = new RigidRectangle(this.mCupid.getXform(),w,h);
    this.mRigidBody.setRestitution(0);
    this.setRigidBody(this.mRigidBody);
    this.mRigidBody.setRestitution(0);
    //this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Cupid,GameObject);

Cupid.prototype.draw = function(aCamera){
    this.mCupid.draw(aCamera);
    this.mArrowSet.draw(aCamera);
}

Cupid.prototype.update = function(aCamera, World){
    var xform = this.getXform();
    //Use WASD to control the Cupid's movement

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
        //xform.incXPosBy(this.kDelta);
        this.mRigidBody.addVelocity(5,0);
        if (this.mRigidBody.mVelocity[0]>50)
            this.mRigidBody.mVelocity[0]=50;
        this.mCupid.setElementPixelPositions(0,277,0,445);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A))
    {
       //xform.incXPosBy(-this.kDelta);
        this.mRigidBody.addVelocity(-5,0);
        if (this.mRigidBody.mVelocity[0]<-50)
            this.mRigidBody.mVelocity[0]=-50;
        this.mCupid.setElementPixelPositions(277,0,0,445);
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space) && !this.mIsInAir)
    {
        this.mRigidBody.setVelocity(this.mRigidBody.mVelocity[0], 120);
        this.mIsInAir = true;
        this.mJumpTimer = 0;
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S))
    {
        xform.incYPosBy(-this.kDelta);
    }

    // if (this.mRigidBody.mVelocity[1]>-0.0001 && this.mOldVelocityY<-1)
    //     this.mIsInAir = false;
    // this.mOldVelocityY = this.mRigidBody.mVelocity[1];

    if (this.mIsInAir = true)
    {
        this.mJumpTimer += 1;
    }

    if (this.mJumpTimer > 10) {
        var PlatformSet = World.mPlatformSet;
        for (var i = 0; i < PlatformSet.size(); i++) {
            if ((this.getBBox().minY() - 1 < PlatformSet.getObjectAt(i).getBBox().maxY())
                && (this.getBBox().maxY() > PlatformSet.getObjectAt(i).getBBox().maxY())
                && (this.getBBox().maxX() < PlatformSet.getObjectAt(i).getBBox().maxX())
                && (this.getBBox().minX() > PlatformSet.getObjectAt(i).getBBox().minX())) {
                this.mIsInAir = false;
            }
        }
    }

    //Use mouse to control the arrow's direction
    if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left))
    {
        this.mSpeedCount += 1;
    }
    if (gEngine.Input.isButtonReleased(gEngine.Input.mouseButton.Left))
    {
        if (this.mSpeedCount > 10) {
            if (this.mSpeedCount > 100)
                this.mSpeedCount = 100;
            var arrow = new Arrow(this.kTexture, this.mCupid, aCamera.mouseWCX(), aCamera.mouseWCY(), this.mSpeedCount * 3);
            this.mArrowSet.addToSet(arrow);

            if (aCamera.mouseWCX() > xform.getXPos()) {
                this.mCupid.setElementPixelPositions(0, 277, 0, 445);
            } else {
                this.mCupid.setElementPixelPositions(277, 0, 0, 445);
            }
        }
        this.mSpeedCount = 0;
    }

    GameObject.prototype.update.call(this);
    this.getXform().setRotationInRad(0);
    this.mArrowSet.update(World);
}