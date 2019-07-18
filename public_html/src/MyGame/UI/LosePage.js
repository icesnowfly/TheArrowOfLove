/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function LosePage(spriteTexture){
    this.BG = new SpriteRenderable(spriteTexture);
    this.BG.getXform().setPosition(100, 75);
    this.BG.getXform().setSize(80, 60);
    this.BG.setElementPixelPositions(0, 512, 0, 512);
    this.BG.setColor([1,1,1,0]);
    this.LevelButton = new UIButton(this.LevelSelect, this, [400, 290], [200, 40], "Select Level", 6);
    this.RestartButton = new UIButton(this.RestartSelect, this, [400, 230], [200, 40], "Restart", 6);
    this.mStatus = null;
}

LosePage.prototype.draw = function(Camera){
    this.BG.draw(Camera);
    this.LevelButton.draw(Camera);
    this.RestartButton.draw(Camera);
};

LosePage.prototype.update = function(){
    this.LevelButton.update();
    this.RestartButton.update();
};

LosePage.prototype.LevelSelect = function(){
    this.mStatus = "Level";
};

LosePage.prototype.RestartSelect = function(){
    this.mStatus = "Restart";
};