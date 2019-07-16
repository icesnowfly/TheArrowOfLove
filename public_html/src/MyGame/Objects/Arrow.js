/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Arrow(spriteTexture, Cupid, toX, toY, speed) {
    var w = 3;
    var h = 15;
    var cxform = Cupid.getXform();
    var vx = toX-cxform.getXPos();
    var vy = toY-cxform.getYPos();
    if (vx>0) //get the flying direction
        this.mDirection = 1;
    else this.mDirection = -1;

    this.mArrow = new SpriteRenderable(spriteTexture);
    this.mArrow.setColor([1, 1, 1, 0]);
    this.mArrow.getXform().setPosition(cxform.getXPos()+8*this.mDirection, cxform.getYPos());
    this.mArrow.getXform().setSize(w, h);
    this.mArrow.setElementPixelPositions(278,328,0,268);
    
    this.mIsDead = false;
    this.mSpeedX = 0.0;
    this.mSpeedY = 0.0;
    this.mIsHit = false;

    GameObject.call(this, this.mArrow);
    
    var r;
    r = new RigidRectangle(this.getXform(), w, h);
    var size = Math.sqrt(vx*vx +vy*vy);
    vx = vx/size;
    vy = vy/size;
    this.mSpeedX = vx * speed;
    this.mSpeedY = vy * speed;
    r.setVelocity(this.mSpeedX, this.mSpeedY);
    var radina = Math.atan(r.mVelocity[1] / r.mVelocity[0]);
    r.mXform.setRotationInRad(radina - Math.PI / 2 * this.mDirection);
    r.setMass(1);
    r.setRestitution(0);
    this.setRigidBody(r);
  //  this.toggleDrawRenderable();
    this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Arrow, GameObject);

Arrow.prototype.update = function (World) {
    var xform = this.getXform();
    var hitPosition = new vec2.create();
    var PlatformSet = World.mPlatformSet;

    var r = this.getRigidBody();
    var radina = Math.atan(r.mVelocity[1] / r.mVelocity[0]);
    this.getRigidBody().mXform.setRotationInRad(radina - Math.PI / 2 * this.mDirection);
    GameObject.prototype.update.call(this);

    //Deal with the collision
    var info = new CollisionInfo();
    for (var i=0;i<PlatformSet.size();i++)
    {
        //if (this.getBBox().intersectsBound(PlatformSet.getObjectAt(i).getBBox()))
        //if (this.pixelTouches(PlatformSet.getObjectAt(i),hitPosition))
        if (r.collisionTest(PlatformSet.getObjectAt(i).getRigidBody(),info))
        {
            this.mIsHit = true;
            break;
        }
    }

    if (xform.getXPos()>200 || xform.getXPos()<0 || xform.getYPos()>150 || xform.getYPos()<0 || this.mIsHit) //Out of the world bound
    {
        this.mIsDead = true;
    }
};