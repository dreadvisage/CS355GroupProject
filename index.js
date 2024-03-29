const WORLD_WIDTH = 1252;
const WORLD_HEIGHT = 646;

const BAR_WIDTH = 80;
const BAR_HEIGHT = 10;
const BAR_DIST_ABOVE_HEAD = 60;
const BAR_MAX_HEALTH = BAR_WIDTH;
const BAR_FILL_COLOR = 0xe74c3c;
const BAR_LINE_COLOR = 0x000000;
const BAR_LINE_WIDTH = 2;

const INDICATOR_LINE_WIDTH = 2;
const INDICATOR_LINE_COLOR = 0xff0000;

const BOBBER_BOMB_EXPLOSION_DMG = 20;

const NEXT_PLAYER_KEY = 'P';
const NEXT_WEAPON_KEY = 'N';

/* Use a class to contain our particular scene for organization sake */
class BearGame extends Phaser.Scene {
    platforms;

    players;
    currentPlayerIndex;
    currentPlayerObj;

    nextPlayerKey;
    swapWeaponKey;

    movementKeys;
    indicatorLine;
    graphics;

    cycleWeaponTextOverlay;
    cyclePlayerTextOverlay;
    deadTextOverlay;

    preload() {
        this.load.image('background', 'assets/background.jpg');

        this.load.image('map1', 'assets/maps/map1.png');

        this.load.image('bear1', 'assets/bear1.png');
        this.load.image('bear2', 'assets/bear2.png');
        this.load.image('bobber-bomb', 'assets/bobber-bomb.png');
        this.load.image('fish-gun', 'assets/fish-gun.png');
        this.load.image('spear', 'assets/spear.png');

    }

    create() {
        this.createBackground();

        this.loadTerrainMap('map1', 5, 1);
        this.createPlayers();

        this.createIndicatorLineResources();
        this.createMouseListeners();

        this.swapWeaponKey = this.input.keyboard.addKey(NEXT_WEAPON_KEY);
        this.nextPlayerKey = this.input.keyboard.addKey(NEXT_PLAYER_KEY);
        this.movementKeys = this.input.keyboard.addKeys('W,UP,D,RIGHT,A,LEFT');
        
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.cameras.main.startFollow(this.currentPlayerObj.sprite, true);

        this.cycleWeaponTextOverlay = this.add.text(300, 300, `Use the \"${NEXT_WEAPON_KEY}\" key to cycle weapons`, { font: '16px Courier', fill: '#000000' }).setOrigin(0).setScale(1);
        this.cyclePlayerTextOverlay = this.add.text(300, 320, `Use the \"${NEXT_PLAYER_KEY}\" key to cycle players`, { font: '16px Courier', fill: '#000000' }).setOrigin(0).setScale(1);
    }

    update() {
        // console.log(`FPS: ${Math.round(game.loop.actualFps)}`);
        this.checkKeyboardInput();
        this.checkMouseInput();

        // move weapons to players
        this.playerObjects.forEach(obj => {
            if (obj.weaponSprite) {
                obj.weaponSprite.x = obj.sprite.x;
                obj.weaponSprite.y = obj.sprite.y;
            }
        });

        // move health bars to players
        this.playerObjects.forEach(obj => {
            obj.healthBar.x = obj.sprite.x - BAR_WIDTH/2;
            obj.healthBar.y = obj.sprite.y - BAR_DIST_ABOVE_HEAD;
        });

        if (!this.playerObjects.length && this.deadTextOverlay) {
            this.deadTextOverlay.destroy();
            this.deadTextOverlay = this.add.text(200, 350, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", { font: '20px Courier', fill: '#ff0000' }).setOrigin(0).setScale(1);
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

        // If we applied any scaling, this will update the bodies
        this.platforms.getChildren().forEach((body) => {
            body.refreshBody();
        });
        
    }

    createBackground() {
        this.add.image(0, 0, 'background')
        .setScale(1)
        .setOrigin(0);

        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    }

    createPlayers() {
        this.playerObjects = [];

        this.createPlayer(450, 420, "bear1", "Player1");
        this.createPlayer(750, 200, "bear2", "Player2");

        this.playerObjects.forEach(obj => {
            this.physics.add.collider(obj.sprite, this.platforms);
        });
        
        this.currentPlayerIndex = 0;
        this.currentPlayerObj = this.playerObjects[this.currentPlayerIndex];
        
    }

    createPlayer(x, y, key, id) {
        const sprite = this.physics.add.sprite(x, y, key)
        .setScale(0.18)
        .refreshBody();
        sprite.setBounce(0);
        sprite.setCollideWorldBounds(true);

        // Center health bar and set it to be a little above the player's head
        const healthBar = this.makeBar(sprite.x - BAR_WIDTH/2, sprite.y - BAR_DIST_ABOVE_HEAD, BAR_FILL_COLOR, BAR_LINE_COLOR);
        this.setBarValue(healthBar, BAR_MAX_HEALTH);

        let playerObj = {
            id: id,
            sprite: sprite,
            health: BAR_MAX_HEALTH,
            healthBar: healthBar,
            // used to initially position weapons and their facing direction relative to the player
            isFacingLeft: false,
            // null means you're using your BEAR hands, lol
            weaponList: [null, 'bobber-bomb', 'fish-gun'],
            weaponIndex: 0,
            weaponKey: null,
            weaponSprite: null,
        };

        this.playerObjects.push(playerObj);
    }

    nextPlayer() {
        this.currentPlayerObj.sprite.setVelocityX(0);

        if (this.playerObjects.length) {
            let nextIndex = ++this.currentPlayerIndex;
            if (nextIndex >= this.playerObjects.length)
                nextIndex = 0;
            this.currentPlayerIndex = nextIndex;
    
            this.currentPlayerObj = this.playerObjects[nextIndex];
            this.cameras.main.startFollow(this.currentPlayerObj.sprite, true);
        } else {
            this.cameras.main.stopFollow();
            this.currentPlayerObj = null;
        }
        
    }

    killPlayer(playerObj) {

        playerObj.health = 0;
        const idx = this.playerObjects.findIndex(obj => obj === playerObj);

        // need to go to the next player if the player kills themselves
        if (this.currentPlayerObj === playerObj) {
            this.nextPlayer();
        }

        const obj = this.playerObjects[idx];
        obj.sprite.destroy();
        obj.healthBar.destroy();
        if (obj.weaponSprite)
            obj.weaponSprite.destroy();
        
        // delete player from player objects array
        this.playerObjects.splice(idx, 1);
    }

    makeBar(x, y, fillColor, outlineColor) {
        let bar = this.add.graphics();

        bar.fillStyle(fillColor);
        bar.fillRect(0, 0, BAR_WIDTH, BAR_HEIGHT);

        bar.lineStyle(1, outlineColor);
        bar.strokeRect(0, 0, BAR_WIDTH, BAR_HEIGHT);
        
        bar.x = x;
        bar.y = y;

        return bar;
    }

    setBarValue(bar, value) {
        bar.clear();

        bar.fillStyle(BAR_FILL_COLOR);
        bar.fillRect(0, 0, value, BAR_HEIGHT);

        bar.lineStyle(BAR_LINE_WIDTH, BAR_LINE_COLOR);
        bar.strokeRect(0, 0, BAR_WIDTH, BAR_HEIGHT);
    }

    createIndicatorLineResources() {
        this.indicatorLine = new Phaser.Geom.Line();
        this.graphics = this.add.graphics({
            lineStyle: { width: INDICATOR_LINE_WIDTH, color: INDICATOR_LINE_COLOR }
        });
    }

    createMouseListeners() {
        this.input.mouse.disableContextMenu();

        this.input.on('pointerup', pointer => {
            if (pointer.leftButtonReleased()) {
                if (this.currentPlayerObj.weaponKey == 'bobber-bomb') {
                    const throwPower = 1.5;
                    let projectile = this.physics.add.sprite(this.currentPlayerObj.sprite.x, this.currentPlayerObj.sprite.y, 'bobber-bomb')
                    .setScale(0.25)
                    .setVelocity(
                        (this.input.activePointer.worldX - this.currentPlayerObj.sprite.x) * throwPower, 
                        (this.input.activePointer.worldY - this.currentPlayerObj.sprite.y) * throwPower
                    )
                    .setMaxVelocity(400, 550)
                    .setDrag(60);
    
                    /* Will disable gravity entirely for the projectiles. More for bullet-style projectiles */
                    // projectile.body.setAllowGravity(false);
                    
                    this.physics.add.collider(projectile, this.platforms, this.terrainExplosionCallback, this.terrainProcessCallback, this);
                    // this.physics.add.collider(projectile, this.playerObjects);
    
                    const timeout_millis = 4000;
                    setTimeout(() => {
                        this.deleteProjectile(projectile);
                    }, timeout_millis);

                    // This is to give the illusion that we threw the bobber bomb
                    this.currentPlayerObj.weaponSprite.destroy();
                    this.currentPlayerObj.weaponSprite = null;
                    this.currentPlayerObj.weaponKey = null;
                } else if (this.currentPlayerObj.weaponKey == 'fish-gun') {
                    const throwPower = 2;
                    var bombSpawnX;
                    if (this.currentPlayerObj.isFacingLeft) {
                        bombSpawnX = this.currentPlayerObj.sprite.x - 30;
                    } else {
                        bombSpawnX = this.currentPlayerObj.sprite.x + 30;
                    }
                    let projectile = this.physics.add.sprite(bombSpawnX, this.currentPlayerObj.sprite.y, 'bobber-bomb')
                    .setScale(0.25)
                    .setVelocity(
                        (this.input.activePointer.worldX - this.currentPlayerObj.sprite.x) * throwPower, 
                        (this.input.activePointer.worldY - this.currentPlayerObj.sprite.y) * throwPower
                    )
                    .setMaxVelocity(400, 550)
                    .setDrag(60);
    
                    /* Will disable gravity entirely for the projectiles. More for bullet-style projectiles */
                    // projectile.body.setAllowGravity(false);
                    
                    this.physics.add.collider(projectile, this.platforms, this.terrainExplosionCallback, this.terrainProcessCallback, this);
                    // this.physics.add.collider(projectile, this.playerObjects);
    
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

    damagePlayerCallback(object1, object2) {
        // obj2 is the player

        for (var i = 0; i < object1.damagePlayerList.length; ++i) {
            const playerObj = object1.damagePlayerList[i][0];
            if (playerObj.sprite === object2 && object1.damagePlayerList[i][1]) {
                const newHealth = playerObj.health - BOBBER_BOMB_EXPLOSION_DMG;
                if (newHealth <= 0) {
                    this.killPlayer(playerObj);
                    
                    if (!this.deadTextOverlay)
                        this.deadTextOverlay = this.add.text(310, 350, `${playerObj.id} IS DEAD AND GAY`, { font: '20px Courier', fill: '#ff0000' }).setOrigin(0).setScale(1);
                } else {
                    playerObj.health = newHealth;
                }
        
                this.setBarValue(playerObj.healthBar, playerObj.health);
                object1.damagePlayerList[i][1] = false;
            }
        }
        
    }



    terrainExplosionCallback(object1, object2) {
        // TODO: the offset is to center the explosion on the sprite (specifically the bobber-bomb right now)
        var invis = this.physics.add.sprite(object1.x - 40, object1.y - 40);
        invis.setCircle(60);
        invis.setImmovable(true);
        invis.setPushable(false);
        invis.body.setAllowGravity(false);

        invis.damagePlayerList = [];
        this.playerObjects.forEach(obj => {
            // the player object and a boolean that represents if this player hasn't been damaged by this particular explosion
            invis.damagePlayerList.push([obj, true]);
        });

        // destroy bobber-bomb
        object1.destroy();

        this.physics.add.collider(invis, this.platforms, this.destroyTerrainCallback, this.terrainProcessCallback, this);
        this.playerObjects.forEach(obj => {
            let collider = this.physics.add.collider(invis, obj.sprite, this.damagePlayerCallback, this.terrainProcessCallback, this);
            collider.overlapOnly = true;
        });
        
        /* Remove the explosion radius after 2 seconds. Should be enough time to check
        for all explosion collisions before we remove it from the scene. This is because I
        currently don't know how to remove it only when there are no more collisions in the 
        explosion radius */
        /* FIXME: Say there are multiple explosions, and destroyed terrain causes the player to fall into the radius of a previous explosion. 
        just by falling into that explosion radius, they may take damage even though they weren't hit by the initial explosion. A short timeout 
        also has issues. IDK the best way to fix. */
        const timeout_millis = 100;
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

        // this.currentPlayerObj would only be null if all the players are killed?
        if (this.currentPlayerObj && this.playerObjects.length) {
            if (this.movementKeys.LEFT.isDown || this.movementKeys.A.isDown) {
                this.currentPlayerObj.sprite.setVelocityX(-160);
                this.currentPlayerObj.sprite.flipX = true;
                this.currentPlayerObj.isFacingLeft = true;
    
                if (this.currentPlayerObj.weaponKey == 'fish-gun')
                    this.currentPlayerObj.weaponSprite.flipX = false;
                
            } else if (this.movementKeys.RIGHT.isDown || this.movementKeys.D.isDown) {
                this.currentPlayerObj.sprite.setVelocityX(160);
                this.currentPlayerObj.sprite.flipX = false;
                this.currentPlayerObj.isFacingLeft = false;
                
    
                if (this.currentPlayerObj.weaponKey == 'fish-gun')
                    this.currentPlayerObj.weaponSprite.flipX = true;
            } else {
                this.currentPlayerObj.sprite.setVelocityX(0);
            }
            
            if ((this.movementKeys.UP.isDown || this.movementKeys.W.isDown) && this.currentPlayerObj.sprite.body.touching.down) {
                this.currentPlayerObj.sprite.setVelocityY(-250);
            }

            if (Phaser.Input.Keyboard.JustDown(this.swapWeaponKey)) {
                if (this.currentPlayerObj.weaponSprite)
                    this.currentPlayerObj.weaponSprite.destroy();
    
                var nextIndex = this.currentPlayerObj.weaponIndex + 1;
                if (nextIndex >= this.currentPlayerObj.weaponList.length)
                    nextIndex = 0;
                const nextWeaponKey = this.currentPlayerObj.weaponList[nextIndex];
                this.currentPlayerObj.weaponIndex = nextIndex;
    
                if (nextWeaponKey) {
                    this.currentPlayerObj.weaponSprite = this.physics.add.sprite(this.currentPlayerObj.sprite.x, this.currentPlayerObj.sprite.y, nextWeaponKey);
                    this.currentPlayerObj.weaponKey = nextWeaponKey;
                }
                    
    
                switch (nextWeaponKey) {
                    case 'bobber-bomb':
                        this.currentPlayerObj.weaponSprite.setScale(0.25);
                        break;
                    case 'fish-gun':
                        this.currentPlayerObj.weaponSprite.setScale(0.2);
                        if (!this.currentPlayerObj.isFacingLeft) {
                            this.currentPlayerObj.weaponSprite.flipX = true;
                        }
                        break;
                    default:
                        this.currentPlayerObj.weaponSprite = null;
                        this.currentPlayerObj.weaponKey = null;
                }
                
                if (this.currentPlayerObj.weaponSprite) {
                    this.currentPlayerObj.weaponSprite.refreshBody();
                    this.currentPlayerObj.weaponSprite.setImmovable(true);
                    this.currentPlayerObj.weaponSprite.body.setAllowGravity(false);
                }
                    
            }
    
            if (Phaser.Input.Keyboard.JustDown(this.nextPlayerKey)) {
                this.nextPlayer();
            }
    
        }

        
        
    }

    checkMouseInput() {
        // this.currentPlayerObj would only be null if all the players are killed?
        if (this.currentPlayerObj && this.playerObjects.length) {
            /* Checks if the mouse left mouse button is being pressed. */
            if (this.input.mousePointer.leftButtonDown()) {
                this.redrawIndicatorLine();
            } else {
                this.graphics.clear();
            }
        }
    }

    /* FIXME: on some platforms, using graphics to strokeLineShape causes the "pixels" to jitter. Unknown how to fix */
    redrawIndicatorLine() {
        this.graphics.clear();
        this.input.activePointer.updateWorldPoint(this.cameras.main);
        this.indicatorLine.setTo(this.currentPlayerObj.sprite.x, this.currentPlayerObj.sprite.y, this.input.activePointer.worldX, this.input.activePointer.worldY);
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