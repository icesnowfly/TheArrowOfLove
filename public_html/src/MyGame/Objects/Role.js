/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Role(spriteTexture, x, y){
    this.mRole = new SpriteRenderable(spriteTexture);
    this.mRole.getXform().setPosition(x, y);
    this.mRole.getXform().setSize(10, 16);
    this.mRole.setColor([1,1,1,0]);
    this.mRole.setElementPixelPositions(0, 256, 0, 412);
    GameObject.call(this, this.mRole);

    this.mIsHit = false;
    this.mTimer = 0;
    var r = new RigidRectangle(this.getXform(), 10, 16);
    this.setRigidBody(r);
    this.getRigidBody().setRestitution(0);
    this.getRigidBody().setFriction(1);
    this.toggleDrawRigidShape();
}
gEngine.Core.inheritPrototype(Role, GameObject);

Role.prototype.update = function(ArrowSet){
    GameObject.prototype.update.call(this);
    var info = new CollisionInfo();
    for (var i=0;i<ArrowSet.size();i++){
        if (this.getRigidBody().collisionTest(ArrowSet.getObjectAt(i).getRigidBody(),info))
        {
            this.mIsHit = true;
            this.mRole.setColor([1,0.6,0.8,0.8]);
            this.mTimer = 0;
            break;
        }
    }
    if (this.mIsHit)
    {
        this.mTimer += 1;
    }
    if (this.mTimer > 300)
    {
        this.mIsHit = false;
        this.mTimer = 0;
        this.mRole.setColor([1,1,1,0]);
    }
    this.getXform().setRotationInRad(0);
};