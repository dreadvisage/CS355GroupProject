
/* Use a class to contain our particular scene for organization sake */
class BearGame extends Phaser.Scene {
    /* Global members in the class */
    platforms;
    player;
    cursors;
    line;

    /* Runs only once. Used to load our assets that we need for the game */
    preload() {
        this.load.image('sky', 'assets/sky-background.jpg');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('player', 'assets/bear.png');
        this.load.image('projectile', 'assets/grenade.png');
    }

    /* Runs only once. Used to do one-time initialization */
    create() {
        /* Load the sky background and place into game */
        this.add.image(0, 0, 'sky')
        .setScale(0.5)
        .setOrigin(0);

        /* Static objects are those that don't move. Our platforms are an example of a good static object.
        Store those objects in the 'platforms' group */
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 410, 'ground');
        this.platforms.create(10, 230, 'ground')
        .setScale(0.6)
        .refreshBody();
        this.platforms.create(700, 170, 'ground')
        .setScale(0.5)
        .refreshBody();

        /* Create our player character */
        this.player = this.physics.add.sprite(350, 300, 'player')
        .setScale(0.2)
        .refreshBody();
        /* Add a little bounce for player impact on the ground */
        this.player.setBounce(0.2);
        /* Restrict movement to the game window. Can't go offscreen. */
        this.player.setCollideWorldBounds(true);

        /* Initialize arrow keys for movement. Still need to check key presses in the 'update()' function */
        this.cursors = this.input.keyboard.createCursorKeys();

        /* Add collision between our player, and all objects within the platforms group */
        this.physics.add.collider(this.player, this.platforms);

        /* This is a listener function that tracks when any mouse button is released. Execute the 
        inner function when any mouse button is released. */
        this.input.on('pointerup', pointer => {
            /* Restrict the mouse release triggers to only execute on the left mouse button release */
            if (pointer.leftButtonReleased()) {
                /* Convenient constant modifier that adjusts how hard we can throw a projectile */
                const throw_power = 2;
                /* Create a projectile object and set properties of it */
                let projectile = this.physics.add.sprite(this.player.x, this.player.y, 'projectile')
                .setScale(0.08)
                /* Velocity is given in X and Y. We calculate the slope between two points: the player X and Y to the
                pointer X and Y. The further the pointer is away from the player, the "harder" the projectile is thrown. 
                How hard an projectile is throw is also determined by the constant 'throw_power' */
                .setVelocity(
                    (pointer.x - this.player.x) * throw_power, 
                    (pointer.y - this.player.y) * throw_power
                )
                /* The fastest an object can go in the X direction is 300. Y direction is 450. You can throw objects up 
                much higher so that you can throw onto a higher platform. But you can't throw them super far horizontally. */
                .setMaxVelocity(300, 450)
                /* Every game 'step', decrease the velocity by an amount, until it reaches zero. Otherwise, objects would 
                keep moving forever in a direction if possible. */
                .setDrag(60);

                /* Will disable gravity entirely for the projectiles. More for bullet-style projectiles */
                // this.projectiles.body.allowGravity = false;
                
                /* Add collision for this projectile object and all the platforms */
                this.physics.add.collider(projectile, this.platforms);

                const timeout_millis = 3000;
                /* Set a timeout that will execute a function when the timeout has elapsed. We use an anonymous function here
                to get around not being able to pass parameters to a function (such as 'deleteProjectile()') directly. Although,
                in this particular scenario, the function isn't needed as is more of a reminder for me that this stuff exists in JS.*/
                setTimeout(() => {
                    /* Delete this projectile when the timeout has elapsed. This deletes the projectile from the game */
                    this.deleteProjectile(projectile);
                }, timeout_millis);
            }
        });
    }

    /* Runs once every frame. Used to do periodic checking and updating of game events. */
    update() {
        /* Checks if left/right arrow are being pressed. Move player left/right corresponding to the button pressed. */
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            /* If no button is pressed, remain still */
            this.player.setVelocityX(0);
        }
        
        /* Checks if the up arrow is being pressed and if the player's bottom side is touching the ground (technically 
            any collidable object). Without checking if they're touching the ground, they could just jump mid-air. Could
            be useful for a double-jump mechanic */
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            /* Set how high the player can jump based on their 'height' in the game. If you're on the bottom platform, you 
            can jump higher than if you're on the top platform. This is to prevent the player from smacking the top of the world 
            bounds while still ensuring they can jump to their desired target. */
            if (this.player.y < 150) {
                this.player.setVelocityY(-200);
            } else if (this.player.y < 200) {
                this.player.setVelocityY(-270);
            } else {
                this.player.setVelocityY(-330);
            }
        }

        /* Checks if the mouse left mouse button is being pressed. */
        if (this.input.mousePointer.leftButtonDown()) {
            /* If our global line isn't null, delete it from the game */
            if (this.line)
                this.line.destroy();

                /* Draw a red line from the player to the mouse pointer. This acts as a visual indicator of how 
                the projectile may be thrown. */
            this.line = this.add.line(0, 0, this.player.x, this.player.y, this.input.activePointer.x, 
                this.input.activePointer.y, 0xff0000, 1)
                /* By default, origin is the top-left corner. By changing it to the center, we can more accurately do 
                what we want to do and use values that make more sense to us, instead of having to calculate offsets. */
                .setOrigin(0);
        } else {
            /* When our left mouse button is released, if our global line isn't null, delete it 
            from the game */
            if (this.line)
                this.line.destroy();
        }
    }



    /* Delete this projectile when the timeout has elapsed. This deletes the projectile from the game */
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
            /* An arbitrary value that determines how strong gravity is */
            gravity: { y: 300 }
        }
    }
};

/* Create our game with our config and scene */
const game = new Phaser.Game(config);