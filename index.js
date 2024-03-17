
/* Use a class to contain our particular scene for organization sake */
class BearGame extends Phaser.Scene {
    /* Global members in the class */
    platforms;

    players;
    currentPlayerIndex;
    currentPlayer;
    nextPlayerKey;

    movementKeys;
    indicatorLine;
    worldPointer;
    graphics;

    /* Runs only once. Used to load our assets that we need for the game */
    preload() {
        this.load.image('background', 'assets/background.jpg');
        // this.load.image('platform', 'assets/platform.png');
        this.load.image('grass-block', 'assets/terrain/grass-block.png');
        this.load.image('dirt-block', 'assets/terrain/dirt-block.png');
        this.load.image('stone-block', 'assets/terrain/stone-block.png');
        this.load.image('sand-block', 'assets/terrain/sand-block.png');
        this.load.image('bear1', 'assets/bear.png');
        this.load.image('projectile', 'assets/grenade.png');
    }

    create() {
        this.createBackground();
        this.createPlatforms();
        this.createPlayers();

        this.createIndicatorLineResources();
        this.createMouseListeners();

        this.nextPlayerKey = this.input.keyboard.addKey('N');
        this.movementKeys = this.input.keyboard.addKeys('W,UP,D,RIGHT,A,LEFT');
        
        this.cameras.main.setBounds(0, 0, 1252, 646);
        this.cameras.main.startFollow(this.currentPlayer, true);
        
    }

    update() {
        this.checkKeyboardInput();
        this.checkMouseInput();
    }

    createBackground() {
        this.add.image(0, 0, 'background')
        .setScale(1)
        .setOrigin(0);

        this.physics.world.setBounds(0, 0, 1252, 646);
    }

    createPlatforms() {
        /* NOTE. Texture bugging warning. It seems like images are scaled every frame when redrawn? This 
        can cause slight texture wobbles when there is a lot going on. Like drawing a indicatorLine every frame when 
        the user is holding left click. It's only the one frame when starting/stopping drawing stuff. To get around it
        maybe bake in the platforms and just invisible collision boxes? Otherwise, just keep the original 1.0 scaling of 
        textures and make a new texture when you need something a different scale. */
        this.platforms = this.physics.add.staticGroup();
        this.platforms.createMultiple({
            key: 'grass-block',
            frameQuantity: 50,
            setXY: { x: 0, y: 640, stepX: 26 },
            setScale: { x: 0.1, y: 0.1 }
            // key: 'platform',
            // frameQuantity: 8,
            // setXY: { x: 0, y: 645, stepX: 187 },
            // setScale: { x: 1.2, y: 1.2 }
        });

        this.platforms.createMultiple({
            key: 'grass-block',
            frameQuantity: 20,
            setXY: { x: 520, y: 614, stepX: 26 },
            setScale: { x: 0.1, y: 0.1 }
            // setScale: { x: 0.9, y: 0.9 }
        });

        // this.platforms.createMultiple({
        //     key: 'platform',
        //     frameQuantity: 3,
        //     setXY: { x: 300, y: 330, stepX: 330 },
        //     // setScale: { x: 0.9, y: 0.9 }
        // });

        // this.platforms.createMultiple({
        //     key: 'platform',
        //     frameQuantity: 2,
        //     setXY: { x: 500, y: 180, stepX: 330 },
        //     // setScale: { x: 0.9, y: 0.9 }
        // });

        this.platforms.getChildren().forEach((body) => {
            body.refreshBody();
        });
    }

    createPlayers() {
        this.players = [];

        const player1 = this.physics.add.sprite(450, 400, 'bear1')
        .setScale(0.15)
        .refreshBody();
        player1.setBounce(0);
        player1.setCollideWorldBounds(true);
        this.players.push(player1);

        // const player2 = this.physics.add.sprite(750, 400, 'bear1')
        // .setScale(0.10)
        // .refreshBody();
        // player2.setBounce(0.4);
        // player2.setCollideWorldBounds(true);
        // player2.setTint(0xf0f0ff);
        // this.players.push(player2);

        // const player3 = this.physics.add.sprite(1050, 400, 'bear1')
        // .setScale(0.20)
        // .refreshBody();
        // player3.setBounce(0.2);
        // player3.setCollideWorldBounds(true);
        // this.players.push(player3);

        this.physics.add.collider(this.players, this.platforms);
        

        this.currentPlayerIndex = 0;
        this.currentPlayer = this.players[this.currentPlayerIndex];
        
    }

    createIndicatorLineResources() {
        this.indicatorLine = new Phaser.Geom.Line();
        this.graphics = this.add.graphics({
            lineStyle: { width: 2, color: 0xff0000 }
        });
    }

    createMouseListeners() {
        this.input.mouse.disableContextMenu();

        this.input.on('pointerup', pointer => {
            if (pointer.leftButtonReleased()) {
                const throwPower = 2;
                let projectile = this.physics.add.sprite(this.currentPlayer.x, this.currentPlayer.y, 'projectile')
                .setScale(0.06)
                .setVelocity(
                    (this.input.activePointer.worldX - this.currentPlayer.x) * throwPower, 
                    (this.input.activePointer.worldY - this.currentPlayer.y) * throwPower
                )
                .setMaxVelocity(400, 550)
                .setDrag(60);

                /* Will disable gravity entirely for the projectiles. More for bullet-style projectiles */
                // projectile.body.setAllowGravity(false);
                
                this.physics.add.collider(projectile, this.platforms, this.terrainCollideCallback, this.terrainProcessCallback, this);
                // this.physics.add.collider(projectile, this.players);

                const timeout_millis = 4000;
                setTimeout(() => {
                    this.deleteProjectile(projectile);
                }, timeout_millis);
            }
        });
    }

    destroyCallback(object1, object2) {
        object2.destroy();
    }

    terrainCollideCallback(object1, object2) {
        console.log(`X: ${object1.x - 25}, Y: ${object1.y - 25}`);
        var invis = this.physics.add.sprite(object1.x - 25, object1.y - 25);
        invis.setCircle(50);
        invis.body.setAllowGravity(false);
        this.physics.add.collider(invis, this.platforms, this.destroyCallback, this.terrainProcessCallback, this);
        // invis.destroy();
        object1.destroy();
        // object2.destroy();
    }

    terrainProcessCallback(object1, object2) {
        return true;
    }

    checkKeyboardInput() {
        if (this.movementKeys.LEFT.isDown || this.movementKeys.A.isDown) {
            this.currentPlayer.setVelocityX(-160);
        } else if (this.movementKeys.RIGHT.isDown || this.movementKeys.D.isDown) {
            this.currentPlayer.setVelocityX(160);
        } else {
            this.currentPlayer.setVelocityX(0);
        }
        
        if ((this.movementKeys.UP.isDown || this.movementKeys.W.isDown) && this.currentPlayer.body.touching.down) {
            if (this.currentPlayer.y < 150) {
                this.currentPlayer.setVelocityY(-250);
            } else {
                this.currentPlayer.setVelocityY(-350);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.nextPlayerKey)) {
            
            this.currentPlayer.setVelocityX(0);

            let nextIndex = ++this.currentPlayerIndex;
            if (nextIndex >= this.players.length)
                nextIndex = 0;
            this.currentPlayerIndex = nextIndex;

            this.currentPlayer = this.players[nextIndex];
            this.cameras.main.startFollow(this.currentPlayer, true);
        }
    }

    checkMouseInput() {
        /* Checks if the mouse left mouse button is being pressed. */
        if (this.input.mousePointer.leftButtonDown()) {
            this.redrawIndicatorLine();
        } else {
            this.graphics.clear();
        }
    }

    

    redrawIndicatorLine() {
        this.graphics.clear();
        this.input.activePointer.updateWorldPoint(this.cameras.main);
        this.indicatorLine.setTo(this.currentPlayer.x, this.currentPlayer.y, this.input.activePointer.worldX, this.input.activePointer.worldY);
        this.graphics.strokeLineShape(this.indicatorLine);
    }

    deleteProjectile(projectile) {
        projectile.destroy()
    }
}

const config = {
    /* Defaults to WebGL, fallback is HTML Canvas */
    type: Phaser.AUTO,
    /* Specified viewport size. The size of the game window */
    width: 800,
    height: 450,
    scene: BearGame,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            /* An arbitrary value that determines how strong gravity is */
            gravity: { y: 300 }
        }
    },
    // scale: {
    //     mode: Phaser.Scale.FIT,
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    // }
};

/* Create our game with our config and scene */
const game = new Phaser.Game(config);