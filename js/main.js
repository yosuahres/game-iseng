function main() {
  const config = {
    parent: 'game',
    type: Phaser.AUTO,
    width: Config.CAMERA_WIDTH_PX,
    height: Config.CAMERA_HEIGHT_PX,
    input: {
      activePointers: 4
    },
    physics: {
      default: 'arcade'
    },
    scene: {
      preload: preloadFn,
      create: createFn,
      update: updateFn
    }
  };
  const game = new Phaser.Game(config);

  var blockList;
  var cursorKeys;
  var director;
  var directorKeys;
  var directorState;
  var gift;
  var grinch;
  var instructions;
  var pathery;
  var patty;
  var santa;
  var victoryCutscene;
  var world;

  const morningMessages = [
    "HAVEEE A WONDERFULL DAAYYYY YAAAA, SMILEE ALWAYSSS",
  ];

  function preloadFn() {
    this.load.spritesheet('girl', 'img/patty.png', {
      frameWidth: Config.PATTY_SPRITE_WIDTH,
      frameHeight: Config.PATTY_SPRITE_HEIGHT
    });
    this.load.spritesheet('santarun', 'img/santarun.png', {
      frameWidth: Config.SANTA_RUN_SPRITE_WIDTH,
      frameHeight: Config.SANTA_RUN_SPRITE_HEIGHT
    });
    this.load.spritesheet('santadead', 'img/santadead.png', {
      frameWidth: Config.SANTA_DEAD_SPRITE_WIDTH,
      frameHeight: Config.SANTA_DEAD_SPRITE_HEIGHT
    });
    this.load.spritesheet('grinchrun', 'img/grinchrun.png', {
      frameWidth: Config.GRINCH_RUN_SPRITE_WIDTH,
      frameHeight: Config.GRINCH_RUN_SPRITE_HEIGHT
    });
    this.load.spritesheet('tree', 'img/tree.png', {
      frameWidth: Config.TREE_SPRITE_WIDTH,
      frameHeight: Config.TREE_SPRITE_HEIGHT
    });
    this.load.spritesheet('justinblink', 'img/justinblink.png', {
      frameWidth: Config.JUSTIN_SPRITE_WIDTH,
      frameHeight: Config.JUSTIN_SPRITE_HEIGHT
    });

    this.load.image('acadia', 'img/acadia.png');
    this.load.image('bkb', 'img/bkb.png');
    this.load.image('bookcase', 'img/bookcase.png');
    this.load.image('confetti1', 'img/confetti1.png');
    this.load.image('confetti2', 'img/confetti2.png');
    this.load.image('confetti3', 'img/confetti3.png');
    this.load.image('confetti4', 'img/confetti4.png');
    this.load.image('confetti5', 'img/confetti5.png');
    this.load.image('confetti6', 'img/confetti6.png');
    this.load.image('confetti7', 'img/confetti7.png');
    this.load.image('counter', 'img/counter.png');
    this.load.image('crate', 'img/crate.png');
    this.load.image('fireplace', 'img/fireplace.png');
    this.load.image('flowers', 'img/flowers.png');
    this.load.image('gift', 'img/gift.png');
    this.load.image('glow', 'img/glow.png');
    this.load.image('grinchfaint', 'img/grinchfaint.png');
    this.load.image('hamilton', 'img/hamilton.png');
    this.load.image('heart', 'img/heart.png');
    this.load.image('liam', 'img/liam.png');
    this.load.image('pathmarker', 'img/pathmarker.png');
    this.load.image('piano', 'img/piano.png');
    this.load.image('rugleft', 'img/rugleft.png');
    this.load.image('rugmiddle', 'img/rugmiddle.png');
    this.load.image('rugtop', 'img/rugtop.png');
    this.load.image('rugtopleft', 'img/rugtopleft.png');
    this.load.image('fam', 'img/fam.png');
    this.load.image('wallright', 'img/wallright.png');
    this.load.image('walltop', 'img/walltop.png');
    this.load.image('walltopright', 'img/walltopright.png');
    this.load.image('wood', 'img/wood.png');
    this.load.image('welcome', 'img/welcome.png');
    this.load.image('window', 'img/window.png');
  }

  function createFn() {
    directorState = new DirectorState();

    const keyboardCursorKeys = this.input.keyboard.createCursorKeys();
    const keyboardDirectorKeys = this.input.keyboard.addKeys('space');

    if (!virtualJoystick) {
      initVirtualJoystick();
    }

    cursorKeys = {
      up: {
        get isDown() {
          return keyboardCursorKeys.up.isDown ||
              (virtualJoystick && virtualJoystick.getCursorKeys().up.isDown);
        }
      },
      down: {
        get isDown() {
          return keyboardCursorKeys.down.isDown ||
              (virtualJoystick && virtualJoystick.getCursorKeys().down.isDown);
        }
      },
      left: {
        get isDown() {
          return keyboardCursorKeys.left.isDown ||
              (virtualJoystick && virtualJoystick.getCursorKeys().left.isDown);
        }
      },
      right: {
        get isDown() {
          return keyboardCursorKeys.right.isDown ||
              (virtualJoystick && virtualJoystick.getCursorKeys().right.isDown);
        }
      }
    };

    directorKeys = {
      space: {
        get isDown() {
          return keyboardDirectorKeys.space.isDown ||
              (virtualJoystick && virtualJoystick.getButtonState('produce'));
        }
      }
    };

    world = new World(this);
    grid = new Grid(this, world);
    pathery = new Pathery(world, grid);
    blockList = new BlockList(this, world, grid, directorState);
    santa = new Santa(this, grid, directorState);
    grinch = new Grinch(this, grid, directorState);
    patty = new Patty(this, world, grid, cursorKeys);
    gift = new Gift(this, grid);
    director = new Director(
        this, grid, pathery, santa, grinch, gift, directorState);
    victoryCutscene = new VictoryCutscene(
        this, patty, gift, directorState,
        ['confetti1','confetti2','confetti3','confetti4',
         'confetti5','confetti6','confetti7']);
    instructions = new Instructions(this);

    this.input.keyboard.on('keydown', function(e) {
      if (e.keyCode == Config.DIRECTOR_PRODUCTION_RUNNING_KEY_CODE) {
        director.toggleProductionRunning();
      }
      if (e.keyCode == Config.RESET_KEY_CODE) {
        // resetWithPresetPuzzle(this);
      }
      if (e.keyCode == Config.TOGGLE_INSTRUCTIONS_KEY_CODE) {
        instructions.toggleVisibility();
      }
    });

    // Wire up pickup button and morning overlay — inside createFn so
    // directorState, gift, grid, patty are all in scope.
    const pickupBtn = document.getElementById('pickup-btn');
    const morningOverlay = document.getElementById('morning-overlay');
    const morningClose = document.getElementById('morning-close');
    const morningText = document.getElementById('morning-text');

    if (pickupBtn) {
      pickupBtn.addEventListener('click', function() {
        pickupBtn.style.display = 'none';
        directorState.setGiftReady(false);

        // Move gift to Patty's feet so VictoryCutscene proximity check passes
        const pattySprite = patty.getSprite();
        gift.getSprite().x = pattySprite.x;
        gift.getSprite().y = pattySprite.y;
        gift.getSprite().visible = true;

        // Mark victorious — VictoryCutscene.update() will detect Patty near gift
        directorState.markVictorious();

        // Show morning message after short delay so confetti fires first
        const msg = morningMessages[
          Math.floor(Math.random() * morningMessages.length)
        ];
        setTimeout(function() {
          if (window.triggerMorningOverlay) {
            window.triggerMorningOverlay(msg);
          }
        }, 800);
      });
    }

    if (morningClose) {
      morningClose.addEventListener('click', function() {
        morningOverlay.style.display = 'none';
      });
    }

    resetWithPresetPuzzle(this);
  }

  function updateFn() {
    if (virtualJoystick && virtualJoystick.checkButtonPress('produce')) {
      director.toggleProductionRunning();
    }
    if (virtualJoystick && virtualJoystick.checkButtonPress('speed')) {
      director.toggleProductionRunning();
    }
    if (virtualJoystick && virtualJoystick.checkButtonPress('instructions')) {
      instructions.toggleVisibility();
    }

    blockList.update(patty.getSprite(), cursorKeys);
    world.checkCollisions(patty.getSprite());

    patty.update();
    santa.update();
    // grinch removed from update
    gift.update();
    victoryCutscene.update();

    checkPickupProximity();
  }

  function checkPickupProximity() {
    const pickupBtn = document.getElementById('pickup-btn');
    if (!pickupBtn) return;

    if (!directorState.isGiftReady() || directorState.isVictorious()) {
      pickupBtn.style.display = 'none';
      return;
    }

    const target = grid.getTargetTile();
    const treeCenter = grid.getTileCenter(target.x, target.y);
    const pattySprite = patty.getSprite();
    const dx = pattySprite.x - treeCenter.x;
    const dy = pattySprite.y - treeCenter.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    pickupBtn.style.display =
        (dist < Config.VICTORY_GIFT_PATTY_PROXIMITY * 2) ? 'block' : 'none';
  }

  function resetWithPresetPuzzle(scene) {
    if (directorState.isVictorious()) return;
    resetPuzzle(scene, 4, 1, 6, 1, 3, 4, 40);
  }

  function resetPuzzle(
      scene, startY, endY, targetX, targetY, pattyX, pattyY, grinchMaxStamina) {
    world.reset();
    grid.reset(startY, endY, {x: targetX, y: targetY});

    const rightWallGapCenter = grid.getTileCenter(0, endY);
    world.renderRightWall(
        rightWallGapCenter.y - Config.GRID_TILE_SIZE_PX / 2,
        rightWallGapCenter.y + Config.GRID_TILE_SIZE_PX / 2);

    blockList.reset();
    blockList.addBlockInGrid(1, 2, 'crate');
    blockList.addBlockInGrid(2, 4, 'crate');
    blockList.addBlockInGrid(4, 6, 'crate');
    blockList.addBlockInGrid(7, 1, 'crate');
    blockList.addBlockInGrid(7, 2, 'crate');
    blockList.addBlockInGrid(8, 5, 'crate');
    blockList.addBlockInGrid(9, 4, 'crate');

    createBlinkAnimation(scene, 'justinBlinking');
    const justin = blockList.addBlockOffGrid(0, -1, 'justinblink', 'justinBlinking');

    santa.hide();
    grinch.reset(grinchMaxStamina);
    gift.hide();
    director.reset();
    patty.reset(justin);

    const pattyBounds = patty.getSprite().getBounds();
    if (world.anyObstacleInRegion(
        pattyBounds.centerX, pattyBounds.centerY,
        pattyBounds.width, pattyBounds.height)) {
      patty.teleportTo(pattyX, pattyY);
    }
  }

  function createBlinkAnimation(scene, animationKey) {
    const frames = [];
    for (var i = 0; i < Config.JUSTIN_BLINKING_RATIO; i++) {
      frames.push({ key: 'justinblink', frame: 0 });
    }
    frames.push({ key: 'justinblink', frame: 1 });
    scene.anims.create({
      key: animationKey,
      frames: frames,
      frameRate: Config.JUSTIN_BLINKING_SPEED,
      repeat: -1
    });
  }
}

window.onload = main;