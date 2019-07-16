//The Game World

function World(Cupid,PlatformSet,Boy,Girl) {
    GameObjectSet.call(this);
    this.addToSet(Cupid);
    this.addToSet(Boy);
    this.addToSet(Girl);
    this.mCupid = Cupid;
    this.mBoy = Boy;
    this.mGirl = Girl;
    this.mPlatformSet = PlatformSet;
    this.mIsWin = false;
    for (var i=0;i<PlatformSet.size();i++)
    {
        this.addToSet(PlatformSet.getObjectAt(i));
    }
}
gEngine.Core.inheritPrototype(World,GameObjectSet);

World.prototype.update = function (aCamera, msg) {
    this.mPlatformSet.update();
    this.mCupid.update(aCamera, this);
    if (!this.mIsWin) {
        this.mBoy.update(this.mCupid.mArrowSet);
        this.mGirl.update(this.mCupid.mArrowSet);
    }
    gEngine.Physics.processCollision(this,[]);
    if (this.mBoy.mIsHit && this.mGirl.mIsHit)
    {
        msg.setText("You Win!");
        msg.setTextHeight(10);
        msg.getXform().setPosition(100,120);
        this.mIsWin = true;
    }
}