const gameState = {
  score: 0,
};

const onScreenButtons = {};

function preload() {
  this.load.image(
    "bug1",
    "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_1.png"
  );
  this.load.image(
    "bug2",
    "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_2.png"
  );
  this.load.image(
    "bug3",
    "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/bug_3.png"
  );
  this.load.image(
    "platform",
    "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/platform.png"
  );
  this.load.image(
    "codey",
    "https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/physics/codey.png"
  );
  this.load.image("leftButton", "assets/leftButton.png");
  this.load.image("rightButton", "assets/rightButton.png");
}

function create() {
  const platforms = this.physics.add.staticGroup();

  platforms.create(320, 350, "platform").setScale(2, 0.5).refreshBody();

  const gameWidth = this.sys.game.canvas.width;
  const gameHeight = this.sys.game.canvas.height;
  console.log(gameWidth);

  //   Left Button

  onScreenButtons.left = this.add.image(
    gameWidth * 0.2,
    gameHeight * 0.8,
    "leftButton"
  );
  onScreenButtons.left.setInteractive();
  onScreenButtons.left.on("pointerdown", () => {
    onScreenButtons.left.isActive = true;
    onScreenButtons.left.setScale(0.8);
  });
  onScreenButtons.left.on("pointerup", () => {
    onScreenButtons.left.isActive = false;
    onScreenButtons.left.setScale(1);
  });

  //   Right Button
  onScreenButtons.right = this.add.image(
    gameWidth * 0.8,
    gameHeight * 0.8,
    "rightButton"
  );
  onScreenButtons.right.setInteractive();
  onScreenButtons.right.on("pointerdown", () => {
    onScreenButtons.right.isActive = true;
    onScreenButtons.right.setScale(0.8);
  });
  onScreenButtons.right.on("pointerup", () => {
    onScreenButtons.right.isActive = false;
    onScreenButtons.right.setScale(1);
  });

  //   Score

  gameState.scoreText = this.add.text(320, 340, "Score: 0", {
    fontSize: "15px",
    fill: "#000",
  });

  this.player = this.physics.add
    .sprite(gameWidth * 0.5, 300, "codey")
    .setScale(0.5);

  this.player.setCollideWorldBounds(true);

  this.physics.add.collider(this.player, platforms);

  const bugs = this.physics.add.group();

  const bugList = ["bug1", "bug2", "bug3"];

  const bugGen = () => {
    const xCoord = Math.random() * 640;
    let randomBug = bugList[Math.floor(Math.random() * 3)];
    bugs.create(xCoord, 10, randomBug);
  };

  const bugGenLoop = this.time.addEvent({
    delay: 250,
    callback: bugGen,
    loop: true,
  });

  this.physics.add.collider(bugs, platforms, function (bug) {
    bug.destroy();
    gameState.score += 15;
    gameState.scoreText.setText(`Score: ${gameState.score}`);
    console.log(gameState.score);
  });

  //   this.physics.world.disableBody(onScreenButtons.left);
  //   this.physics.world.disableBody(onScreenButtons.right);

  this.physics.add.collider(this.player, bugs, () => {
    bugGenLoop.destroy();
    this.physics.pause();

    this.add
      .text(280, 150, "Game Over \n Click HERE to Restart", {
        fontSize: "15px",
        fill: "#000",
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.restart();
      });

    // this.input.on("pointerdown", () => {
    //   this.scene.restart();
    // });
  });
}

// Make Game Mobile Playable Bryant !!!!!!!!!!!

function update() {
  const cursors = this.input.keyboard.createCursorKeys();

  if (cursors.left.isDown || onScreenButtons.left.isActive) {
    this.player.setVelocityX(-200);
  } else if (cursors.right.isDown || onScreenButtons.right.isActive) {
    this.player.setVelocityX(200);
  } else {
    this.player.setVelocityX(0);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  backgroundColor: "b9eaff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      enableBody: true,
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);
