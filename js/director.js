class Director {
  constructor(scene, grid, pathery, santa, grinch, gift, directorState) {
    this.scene_ = scene;
    this.grid_ = grid;
    this.pathery_ = pathery;
    this.santa_ = santa;
    // grinch intentionally unused
    this.gift_ = gift;
    this.directorState_ = directorState;
  }

  reset() {
    this.directorState_.setIsProductionRunning(false);
  }

  toggleProductionRunning() {
    if (this.directorState_.isVictorious()) return;
    if (this.directorState_.isProductionRunning()) {
      this.endProduction_();
      return;
    }
    this.startProduction_();
  }

  startProduction_() {
    const path = this.pathery_.solve();
    if (!path) {
      const startTile = this.grid_.getStartTiles()[0];
      const santaCenter = this.grid_.getTileCenter(startTile.x, startTile.y);
      this.santa_.dieAt(santaCenter.x, santaCenter.y);
      return;
    }

    this.directorState_.setIsProductionRunning(true);
    this.gift_.follow(this.santa_.getRunSprite());

    const santaRun = this.santa_.run(path);

    // When Santa reaches the tree tile, place the gift there
    santaRun.targetPromise.then(() => {
      this.gift_.moveToTarget();
    });

    // When Santa finishes running off screen, production ends
    // and we signal that the gift is ready to pick up
    santaRun.finishPromise.then(() => {
      this.endProduction_();
      this.directorState_.setGiftReady(true);
    });
  }

  endProduction_() {
    this.directorState_.setIsProductionRunning(false);
    this.santa_.hide();
    // gift stays visible on tree — do NOT hide it
  }
}