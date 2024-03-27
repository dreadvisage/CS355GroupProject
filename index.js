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

        this.load.image('terrain-map', 'assets/terrain-map.png');

    }

    create() {


        this.createBackground();

        // this.createPlatforms();
        this.loadTerrainMap('terrain-map', 5, 1);
        this.createPlayers();

        this.createIndicatorLineResources();
        this.createMouseListeners();

        this.nextPlayerKey = this.input.keyboard.addKey('N');
        this.movementKeys = this.input.keyboard.addKeys('W,UP,D,RIGHT,A,LEFT');
        
        this.cameras.main.setBounds(0, 0, 1252, 646);
        this.cameras.main.startFollow(this.currentPlayer, true);
        
    }

    update() {
        // console.log(`FPS: ${Math.round(game.loop.actualFps)}`);
        this.checkKeyboardInput();
        this.checkMouseInput();
    }

    loadTerrainMap(terrainMapKey, terrainPixelScale, platformScale) {

        // load the terrain map texture 
        const texture = game.textures.get(terrainMapKey);
        const img = texture.getSourceImage();
        // null because we don't need to store it in the texture manager, we just need its utilities
        const canvas = this.textures.createCanvas(null, img.width, img.height);
        canvas.draw(0, 0, img);
        
        var set = new Set();
        this.platforms = this.physics.add.staticGroup();
        for (var x = 0; x < img.width; ++x) {
            for (var y = 0; y < img.height; ++y) {
                const pixel = canvas.getPixel(x, y);

                set.add(pixel.color)
                
                var platform;
                switch (pixel.color) {
                    case 7355904: // brown color
                        platform = this.platforms.create(x * terrainPixelScale, y * terrainPixelScale, 'dirt-block');
                        break;
                    case 1141788: // green color
                        platform = this.platforms.create(x * terrainPixelScale, y * terrainPixelScale, 'grass-block');
                        break;
                    case 14729308: // sand color
                        platform = this.platforms.create(x * terrainPixelScale, y * terrainPixelScale, 'sand-block');
                        break;
                    case 7632760: // gray color
                        platform = this.platforms.create(x * terrainPixelScale, y * terrainPixelScale, 'stone-block');
                        break;
                    default:
                        // don't create any collision box
                }

                if (platform)
                    platform.setScale(platformScale);
            }
        }

        console.log(set);

        // If we applied any scaling, this will update the bodies
        this.platforms.getChildren().forEach((body) => {
            body.refreshBody();
        });
        
    }

    createBackground() {
        this.add.image(0, 0, 'background')
        .setScale(1)
        .setOrigin(0);

        this.physics.world.setBounds(0, 0, 1252, 646);
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.createMultiple({
            key: 'dirt-block',
            frameQuantity: 300,
            setXY: { x: 0, y: 640, stepX: 5 },
            setScale: { x: 0.025, y: 0.025 }
            // key: 'platform',
            // frameQuantity: 8,
            // setXY: { x: 0, y: 645, stepX: 187 },
            // setScale: { x: 1.2, y: 1.2 }
        });

        this.platforms.createMultiple({
            key: 'dirt-block',
            frameQuantity: 80,
            setXY: { x: 520, y: 635, stepX: 5 },
            setScale: { x: 0.025, y: 0.025 }
            // setScale: { x: 0.9, y: 0.9 }
        });

        this.platforms.createMultiple({
            key: 'dirt-block',
            frameQuantity: 60,
            setXY: { x: 540, y: 630, stepX: 5 },
            setScale: { x: 0.025, y: 0.025 }
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
                
                this.physics.add.collider(projectile, this.platforms, this.terrainExplosionCallback, this.terrainProcessCallback, this);
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

    terrainExplosionCallback(object1, object2) {
        var invis = this.physics.add.sprite(object1.x - 34, object1.y - 44);
        invis.setCircle(60);
        invis.setImmovable(true);
        invis.body.setAllowGravity(false);

        // destroy grenade
        object1.destroy();

        this.physics.add.collider(invis, this.platforms, this.destroyCallback, this.terrainProcessCallback, this);
        
        /* Remove the explosion radius after 2 seconds. Should be enough time to check
        for all explosion collisions before we remove it from the scene. This is because I
        currently don't know how to remove it only when there are no more collisions in the 
        explosion radius */
        const timeout_millis = 2000;
        setTimeout(() => {
            invis.destroy();
        }, timeout_millis);

        /* This would delete the initial point of contact, but instead we leave that responsibility
        to the explosion radius collider */
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
            this.currentPlayer.setVelocityY(-250);
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

    

    /* FIXME: on some platforms, using graphics to strokeLineShape causes the "pixels" to jitter. Unknown how to fix */
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
            debug: false,
            /* An arbitrary value that determines how strong gravity is */
            gravity: { y: 300 }
        }
    },
    pixelArt: true,
    // scale: {
    //     mode: Phaser.Scale.FIT,
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    // }
};

/* Create our game with our config and scene */
const game = new Phaser.Game(config);