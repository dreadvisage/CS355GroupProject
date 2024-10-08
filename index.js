const WORLD_WIDTH = 1252 * 1.5;
const WORLD_HEIGHT = 646 * 1.5;

const BAR_WIDTH = 80;
const BAR_HEIGHT = 10;
const BAR_HEALTH_DIST_ABOVE_HEAD = 70;
const BAR_STAMINA_DIST_ABOVE_HEAD = 55;
const BAR_MAX_HEALTH = BAR_WIDTH;
const BAR_HEALTH_FILL_COLOR = 0xe74c3c;
const BAR_STAMINA_FILL_COLOR = 0x308c3f;
const BAR_LINE_COLOR = 0x000000;
const BAR_LINE_WIDTH = 2;
const BAR_PLAYER_INDICATOR_DIST_ABOVE_HEAD = 90;

const STAMINA_DIVIDE_MODIFIER = 4;

const INDICATOR_LINE_WIDTH = 2;
const INDICATOR_LINE_COLOR = 0xff0000;

const BOBBER_BOMB_EXPLOSION_DMG = 20;

const NEXT_PLAYER_KEY = 'P';
const NEXT_WEAPON_KEY = 'B';
const CANCEL_ATTACK_KEY = 'ESC';
const BEAR_HANDS_KEY = 'ONE';
const SPEAR_SELECT_KEY=  'TWO';
const GRENADE_SELECT_KEY =  'THREE';
const AK_47_SELECT_KEY = 'FOUR';
const FISH_LAUNCHER_SELECT_KEY = 'FIVE';

const RESET_PLAYER_MILLIS = 1000;
const RESET_PLAYER_DELAY_MILLIS = 1000;
const OUT_OF_BOUNDS_INTERVAL_MILLIS = 500;

const PLAYER_INCLINE_CLIMB_DIST = 1;

const PLAYER_STAMINA = 80;

// Class that contains the main Menu scene
class Menu extends Phaser.Scene {
    constructor() {
        super({ key: 'Menu' });
        
        // Define variables for volume button and mute button
        this.volumeButton;
        this.muteButton;
        this.isMuted = false;
    }

    init(data) {
        // data is passed to this scene from map creation
        this.isMuted = data.isMuted;
        this.isAlreadyPlaying = data.isAlreadyPlaying;
    }

    preload() {
        // Load images
        this.load.image('background', 'assets/background.jpg');
        this.load.image('playButton', 'assets/playButton.png');
        this.load.image('bearTitle', 'assets/bearTitle.png');
        this.load.image('volumeButton', 'assets/volumeButton.png');
        this.load.image('muteButton', 'assets/muteButton.png');
        this.load.image('instructionsButton', 'assets/instructionsButton.png');
        this.load.audio('main-menu-music', 'assets/sounds/main-menu-music.mp3');
    
    }

    create() {
        this.createBackground();
        if (!this.isAlreadyPlaying) {
            this.isAlreadyPlaying = false;
        }
        
        // sounds
        if (!this.isMuted && !this.isAlreadyPlaying) {
            this.sound.play('main-menu-music', {loop: true});
            this.isAlreadyPlaying = true;
        }
        
        // Add bear title image
        this.add.image(400, 150, 'bearTitle');

        // Add volume button
        this.volumeButton = this.add.image(175, 365, 'volumeButton').setInteractive().setScale(0.175);
        this.volumeButton.on('pointerdown', this.toggleMute, this);

        // Add mute button (initially hidden)
        this.muteButton = this.add.image(175, 365, 'muteButton').setInteractive().setScale(0.175);
        this.muteButton.on('pointerdown', this.toggleMute, this);
        this.muteButton.visible = false;

        // Add play button
        this.clickButton = this.add.image(400, 350, 'playButton')
            .setScale(0.6)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                this.scene.start("MapSelect", {isMuted: this.isMuted});
                this.scene.stop("Menu", {isMuted: this.isMuted});
            });

        // Add settings button
        this.clickButton = this.add.image(625, 365, 'instructionsButton')
        .setScale(0.175)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => {
            this.scene.start("InstructionsPage", {isMuted: this.isMuted, isAlreadyPlaying: this.isAlreadyPlaying});
            this.scene.stop("Menu", {isMuted: this.isMuted});
        });
    }

    createBackground() {
        this.add.image(-200, -190, 'background')
            .setScale(1)
            .setOrigin(0);
    }

    toggleMute() {
        if (this.isMuted) {
            // Unmute the game
            this.volumeButton.visible = true;
            this.muteButton.visible = false;
            this.isMuted = false;
            this.sound.play('main-menu-music', {loop: true});
        } else {
            // Mute the game
            this.volumeButton.visible = false;
            this.muteButton.visible = true;
            this.isMuted = true;
            this.sound.stopAll()
        }
    }
}

class Instructions extends Phaser.Scene {

    constructor(){
        super("InstructionsPage")
    }

    init(data) {
        // data is passed to this scene from map creation
        this.isMuted = data.isMuted;
        this.isAlreadyPlaying = data.isAlreadyPlaying;
    }

    preload() {
        // Load images
        this.load.image('background', 'assets/background.jpg');
        this.load.image('instructions', 'assets/instructions.png');
        this.load.image('instructionsButton', 'assets/instructionsButton.png');
    }

    create() {

        this.createBackground();

        this.add.image(400, 200, 'instructions').setScale(.7);

        this.clickButton = this.add.image(625, 365, 'instructionsButton')
        .setScale(0.175)
        .setInteractive({useHandCursor: true})
        .on('pointerdown', () => {
            this.scene.start("Menu", {isMuted: this.isMuted, isAlreadyPlaying: this.isAlreadyPlaying})
            this.scene.stop("Instructions");
        });
    }

    createBackground() {
        this.add.image(-200, -190, 'background')
            .setScale(1)
            .setOrigin(0);
    }
}


// Class that contains the map selector scene
class MapSelect extends Phaser.Scene {

    constructor(){
        super("MapSelect");
    }

    init(data) {
        // data is passed to this scene from map creation
        this.isMuted = data.isMuted;
    }

    preload()
    {
        this.load.image('background', 'assets/background.jpg');
        this.load.image('back1', 'assets/back1.png');
        this.load.image('back2', 'assets/back2.png');
        this.load.image('back3', 'assets/back3.png');
        this.load.image('back4', 'assets/back4.png');
        this.load.image('map1', 'assets/maps/map5.png');
        this.load.image('map2', 'assets/maps/map6.png');
        this.load.image('map3', 'assets/maps/map3Draft2.png');
        this.load.image('map4', 'assets/maps/map4Draft.png');
    }

    create() {

        this.createBackground();

        this.add.image(235, 110, 'back1').setScale(0.4);
        this.add.image(565, 110, 'back2').setScale(0.4);
        this.add.image(235, 325, 'back3').setScale(0.4);
        this.add.image(565, 325, 'back4').setScale(0.4);
        

        /*Each button corresponds to a map. If you click on a map, an integer is saved to
         the "registry" which will be used later. The button also moves user to the next scene.*/
         this.clickButton = this.add.image(235, 85, 'map1')
         .setScale(0.45)
         .setInteractive({useHandCursor: true})
         .on('pointerdown', () => {
             this.registry.set('selectedMapIndex', 1);
             this.sound.stopAll();
             this.scene.start("playGame", {isMuted: this.isMuted})
             this.scene.stop('MapSelect')
         });


     this.clickButton = this.add.image(565, 85, 'map2')
         .setScale(0.45)
         .setInteractive({useHandCursor: true})
         .on('pointerdown', () => {
             this.registry.set('selectedMapIndex', 2);
             this.sound.stopAll();
             this.scene.start("playGame", {isMuted: this.isMuted})
             this.scene.stop('MapSelect')
         });


     this.clickButton = this.add.image(235, 300, 'map3')
         .setScale(0.45)
         .setInteractive({useHandCursor: true})
         .on('pointerdown', () => {
             this.registry.set('selectedMapIndex', 3);
             this.sound.stopAll();
             this.scene.start("playGame", {isMuted: this.isMuted});
             this.scene.stop('MapSelect');
         });


     this.clickButton = this.add.image(565, 300, 'map4')
         .setScale(0.45)
         .setInteractive({useHandCursor: true})
         .on('pointerdown', () => {
             this.registry.set('selectedMapIndex', 4);
             this.sound.stopAll();
             this.scene.start("playGame", {isMuted: this.isMuted})
             this.scene.stop('MapSelect');
         });
    }

    createBackground() {
        this.add.image(-200, -190, 'background')
        .setScale(1)
        .setOrigin(0);
    }
}

class EndScreen extends Phaser.Scene {

    constructor(){
        super("EndScreen");
    }

    preload()
    {
        this.load.image('background', 'assets/background.jpg');
        this.load.image('playerWin', 'assets/winScreen.png');
        this.load.image('menuButton', 'assets/menuButton.png');
    }

    create()
    {
        this.createBackground();

        this.add.image(400, 185, 'playerWin').setScale(0.7);

        this.clickButton = this.add.image(400, 405, 'menuButton')
            .setScale(0.4)
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => {
                window.location.reload();
            });
    }

    createBackground() {
        this.add.image(-200, -190, 'background')
        .setScale(1)
        .setOrigin(0);
    }
}

/* Use a class to contain our particular scene for organization sake */
class BearGame extends Phaser.Scene {

    platforms;

    players;
    currentPlayerIndex;
    currentPlayerObj;
    playerIndicatorGraphic;

    /* This is used to disable user interaction with the game. Such as 
    when a projectile is in-flight and we want to wait for it to land */
    disableInteraction;
    /* Used to stop moving the weaponSprite to each players. Useful when needing
    to play an animation that moves the weaponSprite */
    stopWeaponMove;

    swapWeaponKey;

    movementKeys;
    cancelAttackKey;

    indicatorLine;
    graphics;

    intervalCheck;
    isCancelThrow;

    hud;

    walkSound;
    walkFallTimeout;
    isFalling;
    isMuted;
    weaponText;

    constructor(){
        super("playGame");
    }

    init(data) {
        // data is passed to this scene from map creation
        this.isMuted = data.isMuted;
    }
    
    preload() {
        // backgrounds
        this.load.image('background', 'assets/background.jpg');

        // maps
        this.load.image('map1', 'assets/maps/map1.png');
        this.load.image('map2', 'assets/maps/map2.png');
        this.load.image('map3', 'assets/maps/map3Draft2.png');
        this.load.image('map4', 'assets/maps/map4Draft.png');

        // player sprites
        this.load.image('bear1', 'assets/bear1.png');
        this.load.image('bear2', 'assets/bear2.png');

        // weapon sprites
        this.load.image('bobber-bomb', 'assets/bobber-bomb.png');
        this.load.image('fish-gun', 'assets/fish-gun.png');
        this.load.image('ak-47', 'assets/revolver.png');
        this.load.image('spear', 'assets/spear.png');

        // sounds
        this.load.audio('bobber-bomb-explode', 'assets/sounds/bobber-bomb-explode.mp3');
        this.load.audio('fish-gun-shoot', 'assets/sounds/fish-gun-shoot.mp3');
        this.load.audio('gun-shoot', 'assets/sounds/gun-shoot.mp3');
        this.load.audio('spear-swing', 'assets/sounds/spear-swing.mp3');
        this.load.audio('grenade-pull-pin', 'assets/sounds/grenade-pull-pin.mp3');
        this.load.audio('footsteps', 'assets/sounds/minecraft-footsteps.mp3');
        this.load.audio('bullet-hit', 'assets/sounds/bullet-hit-sound-effect.mp3');
        this.load.audio('background-music', 'assets/sounds/background-music.mp3');
        this.load.audio('jump', 'assets/sounds/jump.mp3');

        // hud buttons
        this.load.image(`settings`, `assets/settingsButton.png`);
        this.load.image(`volume` , `assets/volumebutton.png`) ;
        this.load.image(`mute`, `assets/mutebutton.png`); 
        this.load.image(`spear`, `assets/spear.png`);
        this.load.image(`grenade`, `assets/bobber-bomb.png`);
        this.load.image(`AK47`,`assets/revolver.png`);
        
        // font for text overlays
        //this.fontsReady = false; testing this next
       

    }

    create() {

        this.createBackground();

        // This variable will hold the integer stored in the register from earlier
        const selectedMapIndex = this.registry.get('selectedMapIndex');
        
        // Depending on the what was in the register, a particular map will be loaded
        if(selectedMapIndex === 1){
            this.loadTerrainMap('map1', 5, 1);
        }
        else if(selectedMapIndex === 2){
            this.loadTerrainMap('map2', 5, 1);
        }
        else if(selectedMapIndex === 3){
            this.loadTerrainMap('map3', 5, 1);
        }
        else if(selectedMapIndex === 4){
            this.loadTerrainMap('map4', 5, 1);
        }
      
        this.createPlayers();
        this.playerIndicatorGraphic = this.makePlayerIndicatorGraphic(this.currentPlayerObj.sprite.x, this.currentPlayerObj.sprite.y, BAR_HEALTH_FILL_COLOR, BAR_LINE_COLOR);

        this.createLineResources();
        this.createMouseListeners();

        this.swapWeaponKey = this.input.keyboard.addKey(NEXT_WEAPON_KEY);
        this.spearKey = this.input.keyboard.addKey(SPEAR_SELECT_KEY);
        this.grenadeKey = this.input.keyboard.addKey(GRENADE_SELECT_KEY);
        this.ak47Key = this.input.keyboard.addKey(AK_47_SELECT_KEY);
        this.fishGunKey = this.input.keyboard.addKey(FISH_LAUNCHER_SELECT_KEY);
        this.bearHandsKey = this.input.keyboard.addKey(BEAR_HANDS_KEY);
        this.movementKeys = this.input.keyboard.addKeys('W,UP,D,RIGHT,A,LEFT');
        this.cancelAttackKey = this.input.keyboard.addKey(CANCEL_ATTACK_KEY);

        // sounds
        if (!this.isMuted) {
            this.walkSound = this.sound.add('footsteps');
            this.jumpSound = this.sound.add('jump');
            this.sound.play('background-music', {loop: true});
        }
        

        this.disableUserInteraction = false;
        this.stopWeaponMove = false;
        this.isCancelAttack = false;
        this.canPlayerMove = true;
        
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.cameras.main.startFollow(this.currentPlayerObj.sprite, true);

        //This is where code will go that is associated with the HUD system
        this.hud = this.add.group();
        
        // Weapon text
        this.weaponText = this.add.text(100, 50, `Current weapon: ${this.currentPlayerObj.weaponKey ? this.currentPlayerObj.weaponKey : "Bear Hands"}`, { font: '16px Courier', fill: '#000000' });
        this.weaponText.setOrigin(0.5, 0.5);
        this.weaponText.setScrollFactor(0);
        this.weaponText.x = this.cameras.main.centerX;
        this.hud.add(this.weaponText);
    }

    update() {
        // console.log(`FPS: ${Math.round(game.loop.actualFps)}`);

        this.checkKeyboardInput();
        this.checkMouseInput();

        // move weapons to players
        this.playerObjects.forEach(obj => {
            if (obj.weaponSprite) {
                if (!this.stopWeaponMove) {
                    obj.weaponSprite.x = obj.sprite.x;
                    obj.weaponSprite.y = obj.sprite.y;
                }
                
            }
        });

        // move bars to players
        this.playerObjects.forEach(obj => {
            obj.healthBar.x = obj.sprite.x - BAR_WIDTH/2;
            obj.healthBar.y = obj.sprite.y - BAR_HEALTH_DIST_ABOVE_HEAD;
            obj.staminaBar.x = obj.sprite.x - BAR_WIDTH/2;
            obj.staminaBar.y = obj.sprite.y - BAR_STAMINA_DIST_ABOVE_HEAD;
        });

        // move the player indicator graphic to be above the current player's head
        this.playerIndicatorGraphic.x = this.currentPlayerObj.sprite.x - 10;
        this.playerIndicatorGraphic.y = this.currentPlayerObj.sprite.y - BAR_PLAYER_INDICATOR_DIST_ABOVE_HEAD;

        this.updatePlayerStamina();

        
        this.playerObjects.forEach(obj => {
            if (!this.physics.world.bounds.contains(obj.sprite.x, obj.sprite.y)) {
                this.killPlayer(obj);
            }
        });
        
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
        .setScale(1.5)
        .setOrigin(0);

        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    }

    createPlayers() {
        this.playerObjects = [];

        /* The first starting player this player. Ensure to update both 
        the spawn position and set the lastPlayerPosition to ensure
        proper stamina bar fill */
        const firstPlayerStartX = 50; 
        const firstPlayerStartY = 200;
        this.createPlayer(firstPlayerStartX, firstPlayerStartY, "bear1", "Player1");
        this.lastPlayerPosition = {x: firstPlayerStartX, y: firstPlayerStartY};

        this.createPlayer(1825, 200, "bear2", "Player2");

        // make each player able to collide with the platforms
        this.playerObjects.forEach(obj => {
            this.physics.add.collider(obj.sprite, this.platforms);
        });
        
        // set current player to be the first in the list
        this.currentPlayerIndex = 0;
        this.currentPlayerObj = this.playerObjects[this.currentPlayerIndex];
    }

    // Key is the texture key. ID is the player "name"
    createPlayer(x, y, key, id) {
        const sprite = this.physics.add.sprite(x, y, key)
        .setScale(0.18)
        .refreshBody();
        sprite.setBounce(0);
        // sprite.setCollideWorldBounds(true);
        sprite.setPushable(false);
        // slows down the player if they are "pushed" away
        sprite.setDrag(100);
        sprite.body.setCollideWorldBounds(true);
        sprite.body.world.setBoundsCollision(true, true, true, false);

        // Center health bar and set it to be a little above the player's head
        const healthBar = this.makeBar(sprite.x - BAR_WIDTH/2, sprite.y - BAR_HEALTH_DIST_ABOVE_HEAD, BAR_HEALTH_FILL_COLOR, BAR_LINE_COLOR);
        this.setBarValue(healthBar, BAR_MAX_HEALTH, BAR_HEALTH_FILL_COLOR);
        const staminaBar = this.makeBar(sprite.x - BAR_WIDTH/2, sprite.y - BAR_STAMINA_DIST_ABOVE_HEAD, BAR_STAMINA_FILL_COLOR, BAR_LINE_COLOR);
        this.setBarValue(staminaBar, PLAYER_STAMINA, BAR_STAMINA_FILL_COLOR);

        // Player object
        let playerObj = {
            id: id,
            sprite: sprite,
            health: BAR_MAX_HEALTH,
            healthBar: healthBar,
            stamina: PLAYER_STAMINA,
            staminaBar: staminaBar,
            // used to initially position weapons and their facing direction relative to the player
            isFacingLeft: false,
            // we use this to stop movement when the player is aiming
            isAiming: false,
            // null means you're using your BEAR hands, lol
            weaponList: [null, 'bobber-bomb', 'fish-gun', "ak-47", 'spear'],
            weaponIndex: 0,
            weaponKey: null,
            weaponSprite: null,
        };

        this.playerObjects.push(playerObj);
    }
    

    /* If possible, this will set the current player to the next player in the list. 
    If there are no players in the list (such as being all killed), this will set
    the current player to null */
    nextPlayer() {
        this.currentPlayerObj.sprite.setVelocityX(0);

        if (this.playerObjects.length) {
            let nextIndex = ++this.currentPlayerIndex;
            if (nextIndex >= this.playerObjects.length)
                nextIndex = 0;
            this.currentPlayerIndex = nextIndex;
    
            this.currentPlayerObj = this.playerObjects[nextIndex];
            this.lastPlayerPosition = {x: this.currentPlayerObj.sprite.x, y: this.currentPlayerObj.sprite.y};
            this.currentPlayerObj.stamina = PLAYER_STAMINA;
            this.canPlayerMove = true;
            this.updateHUDWeaponText();
        } else {
            this.cameras.main.stopFollow();
            this.currentPlayerObj = null;
        }
        
    }

    updateHUDWeaponText() {
        let text;
        switch (this.currentPlayerObj.weaponKey) {
            case 'bobber-bomb':
                text = "Bobber Bomb";
                break;
            case 'fish-gun':
                text = "Bobber Launcher";
                break;
            case 'ak-47':
                text = "Fish Revolver";
                break;
            case 'spear':
                text = "Spear";
                break;
            default:
                text = "Bear Hands";
        }
        this.weaponText.setText(`Current weapon: ${text}`);
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
        this.scene.start("EndScreen");
    }


    updatePlayerStamina() {
        var distance_walked_x = Math.abs(this.currentPlayerObj.sprite.x - this.lastPlayerPosition.x);
        // divide by value because i haven't gotten around to having the bars be percentages of values 
        // instead
        distance_walked_x /= STAMINA_DIVIDE_MODIFIER;

        if (this.currentPlayerObj.stamina > 0) {
            this.currentPlayerObj.stamina -= distance_walked_x;
            this.setBarValue(this.currentPlayerObj.staminaBar, this.currentPlayerObj.stamina, BAR_STAMINA_FILL_COLOR);
        } else {
            this.canPlayerMove = false;
        }
        
        // we only want the current player's stamina bar to be visible
        this.playerObjects.forEach(obj => {
            obj.staminaBar.setVisible(obj === this.currentPlayerObj);
        });


        this.lastPlayerPosition = {x: this.currentPlayerObj.sprite.x, y: this.currentPlayerObj.sprite.y};
    }

    makeBar(x, y, fillColor, outlineColor) {
        let bar = this.add.graphics();

        bar.fillStyle(fillColor);
        bar.fillRect(0, 0, BAR_WIDTH, BAR_HEIGHT);

        bar.lineStyle(BAR_LINE_WIDTH, outlineColor);
        bar.strokeRect(0, 0, BAR_WIDTH, BAR_HEIGHT);
        
        bar.x = x;
        bar.y = y;

        return bar;
    }

    setBarValue(bar, value, fillColor) {
        bar.clear();

        bar.fillStyle(fillColor);
        bar.fillRect(0, 0, value, BAR_HEIGHT);

        bar.lineStyle(BAR_LINE_WIDTH, BAR_LINE_COLOR);
        bar.strokeRect(0, 0, BAR_WIDTH, BAR_HEIGHT);
    }

    makePlayerIndicatorGraphic(x, y, fillColor, outlineColor) {
        let indicator = this.add.graphics();

        indicator.fillStyle(0x00ff00);
        indicator.fillTriangle(0, 0, 20, 0, 10, 15)

        indicator.lineStyle(2, outlineColor);
        indicator.strokeTriangle(0, 0, 20, 0, 10, 15);

        return indicator;
    }

    createLineResources() {
        this.indicatorLine = new Phaser.Geom.Line();
        this.indicatorLineGraphics = this.add.graphics({
            lineStyle: { width: INDICATOR_LINE_WIDTH, color: INDICATOR_LINE_COLOR }
        });
    }

    createMouseListeners() {
        this.input.mouse.disableContextMenu();

        this.input.on('pointerup', pointer => {
            if (!this.disableUserInteraction) {
                if (this.isCancelAttack && !pointer.leftButtonDown() && !pointer.rightButtonDown()) {
                    this.isCancelAttack = false;
                } else if (pointer.leftButtonReleased() && this.playerObjects.length && this.currentPlayerObj.sprite.body.touching.down) {
                    /* If left-button was released, there are still players in the game, and the current player is 
                    touching the ground, then proceed. */

                    switch (this.currentPlayerObj.weaponKey) {
                        case 'bobber-bomb':
                            this.useBobberBomb();
                            break;
                        case 'fish-gun':
                            this.useFishGun();
                            break;
                        case 'ak-47':
                            this.useAk47();
                            break;
                        case 'spear':
                            this.useSpear();
                            break;
                    }
    
                    /* When left-button is released, we disable user interaction until a projectile collides with 
                    terrain, or is found to be out of bounds during an interval check. */
                    this.currentPlayerObj.isAiming = false
                    if (this.currentPlayerObj.weaponSprite != null) {
                        this.disableUserInteraction = true;
                        this.indicatorLineGraphics.clear();
                    }
                    
                }
            }
            
        });
    }

    useBobberBomb() {
        const power = 1.5;
        let projectile = this.physics.add.sprite(this.currentPlayerObj.sprite.x, this.currentPlayerObj.sprite.y, 'bobber-bomb')
        .setScale(0.25)
        .setMaxVelocity(400)
        .setVelocity(
            (this.input.activePointer.worldX - this.currentPlayerObj.sprite.x) * power, 
            (this.input.activePointer.worldY - this.currentPlayerObj.sprite.y) * power
        )
        .setDrag(60);
        this.cameras.main.startFollow(projectile, true);

        // sounds
        if (!this.isMuted) {
            this.sound.play('grenade-pull-pin');
        }
        
        /* Will disable gravity entirely for the projectiles. More for bullet-style projectiles */
        // projectile.body.setAllowGravity(false);
        
        this.physics.add.collider(projectile, this.platforms, this.terrainExplosionCallback, this.terrainProcessCallback, this);
        this.playerObjects.forEach(obj => {
            if (obj !== this.currentPlayerObj) {
                this.physics.add.collider(projectile, obj.sprite, this.terrainExplosionCallback, this.terrainProcessCallback, this);
            }
        });
        // this.physics.add.collider(projectile, this.playerObjects);

        // This is to give the illusion that we threw the bobber bomb
        this.currentPlayerObj.weaponSprite.setVisible(false);

        this.checkIntervalOOB(projectile);
    }   

    useFishGun() {
        const power = 2;
        let projectile = this.physics.add.sprite(this.currentPlayerObj.sprite.x, this.currentPlayerObj.sprite.y, 'bobber-bomb')
        .setScale(0.25)
        .setMaxVelocity(550)
        .setVelocity(
            (this.input.activePointer.worldX - this.currentPlayerObj.sprite.x) * power, 
            (this.input.activePointer.worldY - this.currentPlayerObj.sprite.y) * power
        )
        .setDrag(60);
        this.cameras.main.startFollow(projectile, true);

        // sounds
        if (!this.isMuted) {
            this.sound.play('fish-gun-shoot');
        }

        this.physics.add.collider(projectile, this.platforms, this.terrainExplosionCallback, this.terrainProcessCallback, this);
        this.playerObjects.forEach(obj => {
            // Remove collision for the current player to avoid hitting yourself
            if (obj !== this.currentPlayerObj) {
                this.physics.add.collider(projectile, obj.sprite, this.terrainExplosionCallback, this.terrainProcessCallback, this);
            }
        });

        

        this.checkIntervalOOB(projectile);
    }

    /* Randomly gets a float value between the max and min. */
    randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    useAk47() {
        /* Since having a weapon whose accuracy is 100% is kinda busted, we need to introduce
        a small amount of variation that can occasionally cause the player to miss their shot.
        How we do it here is that we generate two random numbers a set amount above and below 
        where the player wants to shoot. We don't want to include values too close to the 
        desired shot location because it's too accurate still. So we generate two random values 
        to remove the range -50 to 50 in this case. Once we have those two values, we keep
        whichever positive/negative value has the most variation from the original shot and 
        apply it to the Y velocity. */
        const variation1 = this.randomNumber(-100, -50);
        const variation2 = this.randomNumber(50, 100);
        var variation;
        if (Math.abs(variation1) >= variation2) {
            variation = variation1;
        } else {
            variation = variation2;
        }


        /* We want the ak-47 to always shoot bullets that are the same speed, no matter how much
        "power" the player may put behind the attack. To do this, we need to calculate the 
        unit vector. Since we use the active pointer to determine the direction, we have to do this
        because the amount of power is determined by how far the active pointer is away from the 
        current player. When calculating the unit vector, instead we solely get the direction of the 
        bullet. Then we can add a fixed amount of "power" behind the bullet.  */
        const unit_vector = new Phaser.Math.Vector2(
            this.input.activePointer.worldX - this.currentPlayerObj.sprite.x, 
            this.input.activePointer.worldY - this.currentPlayerObj.sprite.y
            ).normalize();

        const power = 1000;
        let projectile = this.physics.add.sprite(this.currentPlayerObj.sprite.x, this.currentPlayerObj.sprite.y, 'bobber-bomb')
        .setScale(0.1)
        .setVelocity(
            unit_vector.x * power, 
            (unit_vector.y * power) + variation
        )
        this.cameras.main.startFollow(projectile, true);

        // sounds
        if (!this.isMuted) {
            this.sound.play('gun-shoot');
        }
        
        // Gives a bullet-style behavior by ignoring gravity.
        projectile.body.setAllowGravity(false);
        
        this.physics.add.collider(projectile, this.platforms, this.objectDamageCallback, this.terrainProcessCallback, this);
        this.playerObjects.forEach(obj => {
            this.physics.add.collider(projectile, obj.sprite, this.objectDamageCallback, this.terrainProcessCallback, this);
        });

        this.checkIntervalOOB(projectile);
    }

    useSpear() {
        /* From our indicatorLine, we are given a direction that the spear will be "thrusted" towards.
        However, for an animation, we need to know how far we are thrusting the spear. We can't 
        calculate a fraction of the indicatorLine because it can have variable length. So we need a 
        way to calculate an arbitrary distance along the direction of a line (no matter the length
        of the line). The link below provides a solid overview on how we're calculating the distance.*/
        // https://math.stackexchange.com/questions/175896/finding-a-point-along-a-line-a-certain-distance-away-from-another-point
        
        /* Phaser has a built in way to calculate line length so we don't need to do 
        link's implementation */
        const line_distance = Phaser.Geom.Line.Length(this.indicatorLine);

        // This block is used for the Spear animation
        const distance_along_line = 40;
        const distance_ratio = distance_along_line/line_distance;
        const point = {
            x: (1 - distance_ratio) * this.currentPlayerObj.sprite.x + distance_ratio * this.input.activePointer.worldX,
            y: (1 - distance_ratio) * this.currentPlayerObj.sprite.y + distance_ratio * this.input.activePointer.worldY
        }

        // TODO: change from the bobber bomb to something not dependent on it
        let projectile = this.physics.add.sprite(point.x, point.y, 'bobber-bomb')
        .setScale(0.2);
        projectile.setVisible(false);
        projectile.body.setAllowGravity(false);

        // This block is used for the projectile "hitbox" animation
        const target_distance_along_line = 80;
        const target_distance_ratio = target_distance_along_line/line_distance;
        const target_point = {
            x: (1 - target_distance_ratio) * this.currentPlayerObj.sprite.x + target_distance_ratio * this.input.activePointer.worldX,
            y: (1 - target_distance_ratio) * this.currentPlayerObj.sprite.y + target_distance_ratio * this.input.activePointer.worldY
        }

        // sounds
        if (!this.isMuted) {
            this.sound.play('spear-swing');
        }
        

        // This block produces a quick spear jab forward animation
        const animation_duration_millis = 200;
        this.stopWeaponMove = true;
        // Spear animation
        this.tweens.add({
            targets: this.currentPlayerObj.weaponSprite,
            x: point.x,
            y: point.y,
            ease: 'Power1',
            duration: animation_duration_millis,
            onComplete: () => {
                this.tweens.add({
                    targets: this.currentPlayerObj.weaponSprite,
                    x: this.currentPlayerObj.sprite.x,
                    y: this.currentPlayerObj.sprite.y,
                    ease: 'Power1',
                    duration: animation_duration_millis,
                    onComplete: () => {
                        this.stopWeaponMove = false;
                        this.resetPlayerFromProjectile(100, 100);
                    }
                })
            }
        });
        /* Projectile animation. We don't need the "backwards" animation for the 
        projectile because we are unlikely to "hit" anything when going backwards. 
        Instead just destroy the object. */
        this.tweens.add({
            targets: projectile,
            x: target_point.x,
            y: target_point.y,
            ease: 'Power1',
            duration: animation_duration_millis, 
            onComplete: () => {
                projectile.destroy();
            }
        });

        // Only need colliders for each player. We don't care about the spear hitting terrain.
        this.playerObjects.forEach(obj => {
            // Remove collision for the current player to avoid hitting yourself
            if (obj !== this.currentPlayerObj) {
                this.physics.add.collider(projectile, obj.sprite, this.objectDamageCallback, this.terrainProcessCallback, this);
            }
        });
    }

    // Check interval out-of-bounds
    checkIntervalOOB(projectile) {
        this.intervalCheck = setInterval(() => {
            // If Overlaps returns false, then the projectile is out of bounds
            let isNotOutOfBounds = Phaser.Geom.Rectangle.Overlaps(this.physics.world.bounds, projectile.getBounds());
            if (!isNotOutOfBounds) {
                clearInterval(this.intervalCheck);
                this.resetPlayerFromProjectile(RESET_PLAYER_MILLIS, RESET_PLAYER_DELAY_MILLIS);
            }
        }, OUT_OF_BOUNDS_INTERVAL_MILLIS);
    }

    /* Used in combination with terrainExplosionCallback */
    destroyTerrainCallback(object1, object2) {
        // object2 is the terrain
        object2.destroy();
    }



    /* This will reset the player by panning the camera to the current player. When done panning, user interaction will be enabled 
    and other things needed to set the player back to a "normal" state of play. */
    resetPlayerFromProjectile(reset_player_millis, timeout_millis) {

        /* We have a wrapper timeout over everything because it may take a second for things to process before we can
        check if players are moving. After a second, the velocities should have been changed from zero and worth 
        checking */
        setTimeout(() => {
            var check = function(){
                var isAnyPlayerMoving = true;
    
                this.playerObjects.forEach(obj => {
                    if (obj.sprite.body.velocity.x !== 0 || obj.sprite.body.velocity.y !== 0) {
                        isAnyPlayerMoving = false;
                    }
                });
    
                // if no players are moving
                if(isAnyPlayerMoving){
    
                    setTimeout(() => {
                        this.cameras.main.stopFollow();
                        this.nextPlayer();
                        if (reset_player_millis > 0)
                            this.cameras.main.pan(this.currentPlayerObj.sprite.x, this.currentPlayerObj.sprite.y, reset_player_millis);
                        setTimeout(() => {
                            if (this.currentPlayerObj.weaponSprite) {
                                this.currentPlayerObj.weaponSprite.rotation = 0;
                                /* Specifically, this is for the bobber-bomb because we setVisible to false to give
                                the illusion that we threw it */
                                this.currentPlayerObj.weaponSprite.setVisible(true);
                            }
                            
                            this.disableUserInteraction = false;
                            this.cameras.main.startFollow(this.currentPlayerObj.sprite, true);
                        }, reset_player_millis);
                    }, timeout_millis);
    
                } else {
                    setTimeout(() => {check.call(this)}, 500); // check again in half a second
                }
            }
                
            check.call(this);
        }, 1000);
        

        
        
    }

    /* Used for things like bullets or the "head" of a spear. Something that doesn't explode. */
    objectDamageCallback(object1, object2) {
        // object2 is the player


        // sounds
        if (!this.isMuted) {
            this.sound.play('bullet-hit');
        }

        this.playerObjects.forEach(playerObj => {
            if (playerObj.sprite === object2) {
                const newHealth = playerObj.health - BOBBER_BOMB_EXPLOSION_DMG;
                if (newHealth <= 0) {
                    this.killPlayer(playerObj);
                    // this.scene.start("EndScreen");
                } else {
                    playerObj.health = newHealth;
                }
        
                this.setBarValue(playerObj.healthBar, playerObj.health, BAR_HEALTH_FILL_COLOR);
            }
        });

        object1.destroy();

        /* For most other weapons, we want to reset. But since a few have special animations
        such as the spear, we want to handle those differently elsewhere */
        if (this.currentPlayerObj.weaponKey != 'spear') {
            this.resetPlayerFromProjectile(RESET_PLAYER_MILLIS, RESET_PLAYER_DELAY_MILLIS);
        } else {
            // Calculates Spear knock back
            if (object2.body) {
                const pushBackPoint = {
                    x: object1.x,
                    y: object1.y
                };
                const playerPoint = {
                    x: object2.x,
                    y: object2.y
                };
                const angle = Phaser.Math.Angle.BetweenPoints(pushBackPoint, playerPoint);
                object2.body.velocity.y -= Math.sin(angle) * 200;
                object2.body.velocity.x += Math.cos(angle) * 250;
            }
        }

    }

    /* Used in combination with terrainExplosionCallback */
    explosionDamagePlayerCallback(object1, object2) {
        // obj2 is the player

        for (var i = 0; i < object1.damagePlayerList.length; ++i) {
            const playerObj = object1.damagePlayerList[i][0];
            if (playerObj.sprite === object2 && object1.damagePlayerList[i][1]) {
                const newHealth = playerObj.health - BOBBER_BOMB_EXPLOSION_DMG;
                if (newHealth <= 0) {
                    this.killPlayer(playerObj);
                        // this.scene.start("EndScreen");
                } else {
                    playerObj.health = newHealth;
                }

                if (object2.body) {
                    const pushBackPoint = {
                        x: object1.x + 40,
                        y: object1.y + 40
                    };
                    const playerPoint = {
                        x: object2.x,
                        y: object2.y
                    };
                    const angle = Phaser.Math.Angle.BetweenPoints(pushBackPoint, playerPoint);
                    object2.body.velocity.y += Math.sin(angle) * 400;
                    object2.body.velocity.x += Math.cos(angle) * 250;
                }
        
                this.setBarValue(playerObj.healthBar, playerObj.health, BAR_HEALTH_FILL_COLOR);
                object1.damagePlayerList[i][1] = false;

                
            }
        }
        
    }

    /* Used for objects that "explode" */
    terrainExplosionCallback(object1, object2) {
        // TODO: the offset is to center the explosion on the sprite (specifically the bobber-bomb right now)
        var invis = this.physics.add.sprite(object1.x - 40, object1.y - 40);
        invis.setCircle(60);
        invis.setImmovable(true);
        invis.body.setAllowGravity(false);

        invis.damagePlayerList = [];
        this.playerObjects.forEach(obj => {
            // the player object and a boolean that represents if this player hasn't been damaged by this particular explosion
            invis.damagePlayerList.push([obj, true]);
        });

        // sounds
        if (!this.isMuted) {
            this.sound.play('bobber-bomb-explode');
        }

        // destroy bobber-bomb
        object1.destroy();

        this.physics.add.collider(invis, this.platforms, this.destroyTerrainCallback, this.terrainProcessCallback, this);
        this.playerObjects.forEach(obj => {
            let collider = this.physics.add.collider(invis, obj.sprite, this.explosionDamagePlayerCallback, this.terrainProcessCallback, this);
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


        this.resetPlayerFromProjectile(RESET_PLAYER_MILLIS, RESET_PLAYER_DELAY_MILLIS);
    }

    terrainProcessCallback(object1, object2) {
        return true;
    }

    checkKeyboardInput() {
        if (!this.disableUserInteraction && !this.currentPlayerObj.isAiming) {
            // this.currentPlayerObj would only be null if all the players are killed?
            if (this.currentPlayerObj && this.playerObjects.length) {
                if (this.movementKeys.LEFT.isDown || this.movementKeys.A.isDown) {
                    this.currentPlayerObj.sprite.flipX = true;
                    this.currentPlayerObj.isFacingLeft = true;
                    if (this.currentPlayerObj.weaponKey == 'fish-gun' 
                        || this.currentPlayerObj.weaponKey == 'ak-47'
                        || this.currentPlayerObj.weaponKey == 'spear')
                            this.currentPlayerObj.weaponSprite.flipX = true;


                    if (this.canPlayerMove) {
                        this.currentPlayerObj.sprite.setVelocityX(-160);
                        if (this.walkSound && !this.walkSound.isPlaying) {
                            this.walkSound.play();
                        }

                        // If blocked, player does a little hop to try and traverse the distance
                        if (this.currentPlayerObj.sprite.body.blocked.left) {
                            this.currentPlayerObj.sprite.y -= PLAYER_INCLINE_CLIMB_DIST;
                        }
                    } else {
                        this.currentPlayerObj.sprite.setVelocityX(0);
                        if (this.walkSound) {
                            this.walkSound.pause()
                        }
                    }  
                    
                } else if (this.movementKeys.RIGHT.isDown || this.movementKeys.D.isDown) {
                    this.currentPlayerObj.sprite.flipX = false;
                    this.currentPlayerObj.isFacingLeft = false;
                    if (this.currentPlayerObj.weaponKey == 'fish-gun' 
                        || this.currentPlayerObj.weaponKey == 'ak-47'
                        || this.currentPlayerObj.weaponKey == 'spear')
                            this.currentPlayerObj.weaponSprite.flipX = false;


                    if (this.canPlayerMove) {
                        this.currentPlayerObj.sprite.setVelocityX(160);
                        if (this.walkSound && !this.walkSound.isPlaying) {
                            this.walkSound.play();
                        }
                        
                        // If blocked, player does a little hop to try and traverse the vertical distance
                        if (this.currentPlayerObj.sprite.body.blocked.right) {
                            this.currentPlayerObj.sprite.y -= PLAYER_INCLINE_CLIMB_DIST;
                        }
                    } else {
                        this.currentPlayerObj.sprite.setVelocityX(0);
                        if (this.walkSound) {
                            this.walkSound.pause();
                        }
                    }
                } else {
                    this.currentPlayerObj.sprite.setVelocityX(0);
                    if (this.walkSound) {
                        this.walkSound.pause();
                    }
                }

                // if the player is touching the ground, they can jump again so we stop the sound.
                if (this.jumpSound && this.currentPlayerObj.sprite.body.touching.down) {
                    this.jumpSound.stop();
                }

                // This block controls jumping
                if ((this.movementKeys.UP.isDown || this.movementKeys.W.isDown) && this.currentPlayerObj.sprite.body.touching.down) {
                    this.currentPlayerObj.sprite.setVelocityY(-250);
                    if (this.jumpSound && !this.jumpSound.isPlaying) {
                        this.jumpSound.play();
                    }
                }

                if (Phaser.Input.Keyboard.JustDown(this.spearKey)) {
                    if (this.currentPlayerObj.weaponSprite)
                        this.currentPlayerObj.weaponSprite.destroy();

                    this.currentPlayerObj.weaponIndex = 4;
                    const nextWeaponKey = this.currentPlayerObj.weaponList[4];
                    this.currentPlayerObj.weaponSprite = this.physics.add.sprite(this.currentPlayerObj.sprite.x, this.currentPlayerObj.sprite.y, nextWeaponKey);
                    this.currentPlayerObj.weaponKey = nextWeaponKey;
                    this.currentPlayerObj.weaponSprite.setScale(0.25);
                    if (this.currentPlayerObj.isFacingLeft) {
                        this.currentPlayerObj.weaponSprite.flipX = true;
                    }
                    this.currentPlayerObj.weaponSprite.setImmovable(true);
                    this.currentPlayerObj.weaponSprite.body.setAllowGravity(false);
                    this.updateHUDWeaponText();
                }
                if (Phaser.Input.Keyboard.JustDown(this.grenadeKey)) {
                    if (this.currentPlayerObj.weaponSprite)
                        this.currentPlayerObj.weaponSprite.destroy();

                    this.currentPlayerObj.weaponIndex = 1;
                    const nextWeaponKey = this.currentPlayerObj.weaponList[1];
                    this.currentPlayerObj.weaponSprite = this.physics.add.sprite(this.currentPlayerObj.sprite.x, this.currentPlayerObj.sprite.y, nextWeaponKey);
                    this.currentPlayerObj.weaponKey = nextWeaponKey;
                    this.currentPlayerObj.weaponSprite.setScale(0.25);
                    if (this.currentPlayerObj.isFacingLeft) {
                        this.currentPlayerObj.weaponSprite.flipX = true;
                    }
                    this.currentPlayerObj.weaponSprite.setImmovable(true);
                    this.currentPlayerObj.weaponSprite.body.setAllowGravity(false);
                    this.updateHUDWeaponText();
                }
                if (Phaser.Input.Keyboard.JustDown(this.ak47Key)) {
                    if (this.currentPlayerObj.weaponSprite)
                        this.currentPlayerObj.weaponSprite.destroy();

                    this.currentPlayerObj.weaponIndex = 3;
                    const nextWeaponKey = this.currentPlayerObj.weaponList[3];
                    this.currentPlayerObj.weaponSprite = this.physics.add.sprite(this.currentPlayerObj.sprite.x, this.currentPlayerObj.sprite.y, nextWeaponKey);
                    this.currentPlayerObj.weaponKey = nextWeaponKey;
                    this.currentPlayerObj.weaponSprite.setScale(0.25);
                    if (this.currentPlayerObj.isFacingLeft) {
                        this.currentPlayerObj.weaponSprite.flipX = true;
                    }
                    this.currentPlayerObj.weaponSprite.setImmovable(true);
                    this.currentPlayerObj.weaponSprite.body.setAllowGravity(false);
                    this.updateHUDWeaponText();
                }
                if (Phaser.Input.Keyboard.JustDown(this.fishGunKey)) {
                    if (this.currentPlayerObj.weaponSprite)
                        this.currentPlayerObj.weaponSprite.destroy();

                    this.currentPlayerObj.weaponIndex = 2;
                    const nextWeaponKey = this.currentPlayerObj.weaponList[2];
                    this.currentPlayerObj.weaponSprite = this.physics.add.sprite(this.currentPlayerObj.sprite.x, this.currentPlayerObj.sprite.y, nextWeaponKey);
                    this.currentPlayerObj.weaponKey = nextWeaponKey;
                    this.currentPlayerObj.weaponSprite.setScale(0.20);
                    if (this.currentPlayerObj.isFacingLeft) {
                        this.currentPlayerObj.weaponSprite.flipX = true;
                    }
                    this.currentPlayerObj.weaponSprite.setImmovable(true);
                    this.currentPlayerObj.weaponSprite.body.setAllowGravity(false);
                    this.updateHUDWeaponText();
                }
                if (Phaser.Input.Keyboard.JustDown(this.bearHandsKey)) {
                    if (this.currentPlayerObj.weaponSprite)
                        this.currentPlayerObj.weaponSprite.destroy();

                    this.currentPlayerObj.weaponIndex = 0;
                    this.currentPlayerObj.weaponSprite = null;
                    this.currentPlayerObj.weaponKey = null;
                    this.updateHUDWeaponText();
                }
                /* Swapping weapons entails deleting the old weapon sprite and spawning in a new one. Also updating
                the relevant values in the this.currentPlayerObj */
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
                            if (this.currentPlayerObj.isFacingLeft) {
                                this.currentPlayerObj.weaponSprite.flipX = true;
                            }
                            break;
                        case 'ak-47':
                            this.currentPlayerObj.weaponSprite.setScale(0.15);
                            if (this.currentPlayerObj.isFacingLeft) {
                                this.currentPlayerObj.weaponSprite.flipX = true;
                            }
                            break;
                        case 'spear':
                            this.currentPlayerObj.weaponSprite.setScale(0.25);
                            if (this.currentPlayerObj.isFacingLeft) {
                                this.currentPlayerObj.weaponSprite.flipX = true;
                            }
                            break;
                        default:
                            this.currentPlayerObj.weaponSprite = null;
                            this.currentPlayerObj.weaponKey = null;
                    }
                    
                    if (this.currentPlayerObj.weaponSprite) {
                        // NOTE: refreshing the body here causes an offset of the initial spawn position. idk why
                        // this.currentPlayerObj.weaponSprite.refreshBody();
                        this.currentPlayerObj.weaponSprite.setImmovable(true);
                        this.currentPlayerObj.weaponSprite.body.setAllowGravity(false);
                    }
                    this.updateHUDWeaponText();
                        
                }

            }
    
        } else {
            // FIXME. Ideally, I would set the this.currentPlayerObj to null to indicate there
            // are no more available players
            // IDK what this does, I removed it and it seems to do nothing
            // if (this.currentPlayerObj.sprite.body) {
            //     this.currentPlayerObj.sprite.setVelocityX(0);
            // }

        }

        
        
    }

    checkMouseInput() {
        if (!this.disableUserInteraction) {
            // this.currentPlayerObj would only be null if all the players are killed?
            if (this.currentPlayerObj && this.playerObjects.length) {
                if (this.input.mousePointer.leftButtonDown() && (this.input.mousePointer.rightButtonDown() || this.cancelAttackKey.isDown)) {
                    /* If both mouse buttons are being pressed, we cancel the current attack and only allow attacking
                    again if both mouse buttons are released */
                    this.currentPlayerObj.isAiming = false;
                    if (this.currentPlayerObj.weaponSprite) {
                        this.currentPlayerObj.weaponSprite.rotation = 0;
                    }
                    this.disableUserInteraction = false;
                    this.isCancelAttack = true;
                    this.indicatorLineGraphics.clear();
                } else if (!this.isCancelAttack && this.input.mousePointer.leftButtonDown() && this.currentPlayerObj.sprite.body.touching.down) {

                    // Player will keep moving and keep making sound if the movement keys are held down at the same time as left-click otherwise
                    this.currentPlayerObj.sprite.setVelocity(0);
                    if (this.walkSound) {
                        this.walkSound.stop();
                    }

                    // need to update the world point relative to the camera so that it's accurate when we use the point
                    this.input.activePointer.updateWorldPoint(this.cameras.main);
                    this.currentPlayerObj.isAiming = true;
                    // redraw the indicator line
                    this.redrawLines();
                    // rotate the weapon towards the mouse cursor
                    this.rotateWeaponToIndicatorLine();
                } else {
                    this.indicatorLineGraphics.clear();
                }
            }
        }
        
    }

    rotateWeaponToIndicatorLine() {
        if (this.currentPlayerObj.weaponSprite) {
            const point1 = {
                x: this.currentPlayerObj.sprite.x,
                y: this.currentPlayerObj.sprite.y,
            };
            const point2 = {
                x: this.input.activePointer.worldX,
                y: this.input.activePointer.worldY,
            };
    
            // Calculate angle between two points in radians
            const radians = Phaser.Math.Angle.BetweenPoints(point1, point2);

            // Angle the player and their weapon towards the indicator line
            if (radians > Math.PI/2 || radians < -Math.PI/2) {
                this.currentPlayerObj.sprite.flipX = true;
                this.currentPlayerObj.isFacingLeft = true;
                this.currentPlayerObj.weaponSprite.flipX = true;
            } else {
                this.currentPlayerObj.sprite.flipX = false;
                this.currentPlayerObj.isFacingLeft = false;
                this.currentPlayerObj.weaponSprite.flipX = false;
            }

            /* Since we flip the sprite based on the direction the player is traveling, we 
            need to find the opposite angle if they are facing left*/
            if (this.currentPlayerObj.isFacingLeft) {
                this.currentPlayerObj.weaponSprite.rotation = radians + Math.PI;
            } else {
                this.currentPlayerObj.weaponSprite.rotation = radians;
            }
        }
        
    }

    /* FIXME: on some platforms, using graphics to strokeLineShape causes the "pixels" to jitter. Unknown how to fix */
    redrawLines() {
        this.indicatorLineGraphics.clear();

        const sprite = this.currentPlayerObj.sprite;
        this.indicatorLine.setTo(sprite.x, sprite.y, this.input.activePointer.worldX, this.input.activePointer.worldY);
        this.indicatorLineGraphics.strokeLineShape(this.indicatorLine);

    }
}

const config = {
    /* Defaults to WebGL, fallback is HTML Canvas */
    type: Phaser.AUTO,
    /* Specified viewport size. The size of the game window */
    width: 800,
    height: 450,
    scene: [Menu, Instructions, MapSelect, BearGame, EndScreen],
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