//The Game World

function World(Cupid,PlatformSet,Boy,Girl) {
    GameObjectSet.call(this);
    //this.addToSet(Cupid);
    this.addToSet(Boy);
    this.addToSet(Girl);
    this.mCupid = Cupid;
    this.mBoy = Boy;
    this.mGirl = Girl;
    this.mPlatformSet = PlatformSet;
    this.mIsWin = false;
    this.mIsLose = false;
    for (var i=0;i<PlatformSet.size();i++)
    {
        this.addToSet(PlatformSet.getObjectAt(i));
    }
}
gEngine.Core.inheritPrototype(World,GameObjectSet);

World.prototype.update = function (aCamera, msg) {
    this.mPlatformSet.update();
    this.mCupid.update(this);
    if (!this.mIsWin) {
        this.mBoy.update(this.mCupid.mArrowSet);
        this.mGirl.update(this.mCupid.mArrowSet);
    }
    gEngine.Physics.processCollision(this,[]);
    if (this.mBoy.mIsHit && this.mGirl.mIsHit)
    {
        this.mIsWin = true;
    }
    var xform = this.mCupid.getXform();
    if (xform.getYPos()<-20) //Out of the world bound
    {
        this.mIsLose = true;
    }
}