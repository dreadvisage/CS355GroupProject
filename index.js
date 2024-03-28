/* Use a class to contain our particular scene for organization sake */
class BearGame extends Phaser.Scene {
    /* Global members in the class */
    platforms;

    players;
    currentPlayerIndex;
    currentPlayer;
    nextPlayerKey;

    // used to initially position weapons and their facing direction relative to the player
    isPlayerFacingLeft;

    swapWeaponKey;
    weaponListIndex;
    weaponList;
    currentWeapon;
    currentWeaponKey;

    movementKeys;
    indicatorLine;
    graphics;

    textOverlay;

    preload() {
        this.load.image('background', 'assets/background.jpg');
        this.load.image('grass-block', 'assets/terrain/grass-block.png');
        this.load.image('dirt-block', 'assets/terrain/dirt-block.png');
        this.load.image('stone-block', 'assets/terrain/stone-block.png');
        this.load.image('sand-block', 'assets/terrain/sand-block.png');

        this.load.image('terrain-map', 'assets/terrain-map.png');

        this.load.image('bear', 'assets/bear.png');
        this.load.image('bobber-bomb', 'assets/bobber-bomb.png');
        this.load.image('fish-gun', 'assets/fish-gun.png');
        this.load.image('spear', 'assets/spear.png');

    }

    create() {


        this.createBackground();

        // this.createPlatforms();
        this.loadDynamicTerrainMap('terrain-map', 5, 1);
        this.createPlayers();

        this.createIndicatorLineResources();
        this.createMouseListeners();

        this.swapWeaponKey = this.input.keyboard.addKey('P');
        this.nextPlayerKey = this.input.keyboard.addKey('N');
        this.movementKeys = this.input.keyboard.addKeys('W,UP,D,RIGHT,A,LEFT');

        this.weaponListIndex = 0;
        // null means you're using your BEAR hands, lol
        this.weaponList = [null, 'bobber-bomb', 'fish-gun'];
        
        this.cameras.main.setBounds(0, 0, 1252, 646);
        this.cameras.main.startFollow(this.currentPlayer, true);

        this.textOverlay = this.add.text(300, 300, "Use the \"P\" key to cycle weapons", { font: '16px Courier', fill: '#000000' }).setOrigin(0).setScale(1);
    }


    update() {
        // console.log(`FPS: ${Math.round(game.loop.actualFps)}`);
        this.checkKeyboardInput();
        this.checkMouseInput();

        // move weapon to player
        if (this.currentWeapon) {
            this.currentWeapon.x = this.currentPlayer.x;
            this.currentWeapon.y = this.currentPlayer.y;
        }
    }

    
    loadTerrainMap(terrainMapKey, terrainPixelScale, platformScale) {
        // Load the terrain map texture 
        const texture = game.textures.get(terrainMapKey);
        const img = texture.getSourceImage();
        /* We use `null` because we don't need to store it in the texture manager, we just need 
        the CanvasTexture function utilities */
        const canvas = this.textures.createCanvas(null, img.width, img.height);
        canvas.draw(0, 0, img);
    
        /* This Set stores the texture keys that are utilized by Phaser. Each unique pixel 
        color from our terrain map will be stored in this Set and will serve as a cache 
        if we already created a Phaser texture whose pixel value exists. Therefore, we're not 
        creating a whole new texture, if it already exists.*/
        var set = new Set();
        this.platforms = this.physics.add.staticGroup();
        // Iterate through all the pixels in the terrain map
        for (var x = 0; x < img.width; ++x) {
            for (var y = 0; y < img.height; ++y) {
                const pixel = canvas.getPixel(x, y);

                /* If the terrain map has a black pixel, it signifies that
                there is no terrain at that spot */
                if (pixel.color === 0) {
                    continue;
                }

                var platform;
                const val = set.has(pixel.color) ? pixel.color : undefined;
                /* If the value doesn't exist within the Set, create a new texture with that 
                pixel color. Otherwise, just use the cached value to create the platform. */
                if (val === undefined) {
                    /* Create an HTML canvas that will be used as the backing for a Phaser 
                    CanvasTexture */
                    const htmlCanvas = document.createElement("canvas");
                    htmlCanvas.width = terrainPixelScale;
                    htmlCanvas.height = terrainPixelScale;
                    const htmlCtx = htmlCanvas.getContext('2d');
                    htmlCtx.fillStyle = `rgb(${pixel.red},${pixel.green},${pixel.blue})`;
                    htmlCtx.fillRect(0, 0, terrainPixelScale, terrainPixelScale);

                    var phaserCanvas = this.textures.createCanvas(pixel.color, terrainPixelScale, terrainPixelScale);
                    phaserCanvas.draw(0, 0, htmlCanvas);

                    /* Add the unique pixel color to our cached values, of which it is also a
                    unique Phaser texture key */
                    set.add(pixel.color);

                    platform = this.platforms.create(x * terrainPixelScale, y * terrainPixelScale, pixel.color);
                } else {
                    platform = this.platforms.create(x * terrainPixelScale, y * terrainPixelScale, val);
                }

                if (platform)
                    platform.setScale(platformScale);
            }
        }

        // console.log(set);

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

    createPlayers() {
        this.players = [];

        const player1 = this.physics.add.sprite(450, 400, 'bear')
        .setScale(0.18)
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
                if (this.currentWeaponKey == 'bobber-bomb') {
                    const throwPower = 1.5;
                    let projectile = this.physics.add.sprite(this.currentPlayer.x, this.currentPlayer.y, 'bobber-bomb')
                    .setScale(0.25)
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

                    // This is to give the illusion that we threw the bobber bomb
                    this.currentWeapon.destroy();
                    this.currentWeapon = null;
                    this.currentWeaponKey = null;
                } else if (this.currentWeaponKey == 'fish-gun') {
                    const throwPower = 2;
                    var bombSpawnX;
                    var bombSpawnY;
                    if (this.isPlayerFacingLeft) {
                        bombSpawnX = this.currentPlayer.x - 30;
                    } else {
                        bombSpawnX = this.currentPlayer.x + 30;
                    }
                    let projectile = this.physics.add.sprite(bombSpawnX, this.currentPlayer.y, 'bobber-bomb')
                    .setScale(0.25)
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
            }
        });
    }

    destroyTerrainCallback(object1, object2) {
        object2.destroy();
    }

    terrainExplosionCallback(object1, object2) {
        // the offset is to center the explosion on the sprite
        var invis = this.physics.add.sprite(object1.x - 40, object1.y - 40);
        invis.setCircle(60);
        invis.setImmovable(true);
        invis.body.setAllowGravity(false);

        // destroy grenade
        object1.destroy();

        this.physics.add.collider(invis, this.platforms, this.destroyTerrainCallback, this.terrainProcessCallback, this);
        
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
            this.currentPlayer.flipX = true;
            this.isPlayerFacingLeft = true;

            if (this.currentWeaponKey == 'fish-gun')
                this.currentWeapon.flipX = false;
            
        } else if (this.movementKeys.RIGHT.isDown || this.movementKeys.D.isDown) {
            this.currentPlayer.setVelocityX(160);
            this.currentPlayer.flipX = false;
            this.isPlayerFacingLeft = false;

            if (this.currentWeaponKey == 'fish-gun')
                this.currentWeapon.flipX = true;
        } else {
            this.currentPlayer.setVelocityX(0);
        }
        
        if ((this.movementKeys.UP.isDown || this.movementKeys.W.isDown) && this.currentPlayer.body.touching.down) {
            this.currentPlayer.setVelocityY(-250);
        }

        if (Phaser.Input.Keyboard.JustDown(this.swapWeaponKey)) {
            if (this.currentWeapon)
                this.currentWeapon.destroy();

            var nextIndex = this.weaponListIndex + 1;
            if (nextIndex >= this.weaponList.length)
                nextIndex = 0;
            const nextWeaponKey = this.weaponList[nextIndex];
            this.weaponListIndex = nextIndex;

            if (nextWeaponKey) {
                this.currentWeapon = this.physics.add.sprite(this.currentPlayer.x, this.currentPlayer.y, nextWeaponKey);
                this.currentWeaponKey = nextWeaponKey;
            }
                

            switch (nextWeaponKey) {
                case 'bobber-bomb':
                    this.currentWeapon.setScale(0.25);
                    break;
                case 'fish-gun':
                    this.currentWeapon.setScale(0.2);
                    if (!this.isPlayerFacingLeft) {
                        this.currentWeapon.flipX = true;
                    }
                    break;
                default:
                    this.currentWeapon = null;
                    this.currentWeaponKey = null;
            }
            
            if (this.currentWeapon) {
                this.currentWeapon.refreshBody();
                this.currentWeapon.setImmovable(true);
                this.currentWeapon.body.setAllowGravity(false);
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