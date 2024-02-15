# Project Setup Preface
This project requires setting up a local web server as a way to safely and securely serve files. [Phaser](https://phaser.io/) is the JavaScript game development library of choice for this project. 

## XAMPP
The recommended web server for this project is XAMPP. If you don't know how to install XAMPP, find a guide on the internet for your operating system. In order to use XAMPP, and therefore this project, ensure that the Apache web server as part of XAMPP, is up and running.
* Windows/Mac: Open up the GUI app
* Arch Linux: sudo xampp start

Once XAMPP is installed, clone this repository to a location of your choosing. See next section considerations on where you should clone the repository to.
* `git clone https://github.com/dreadvisage/CS355GroupProject`

## Making the Website Accessible by XAMPP
You have two main options when helping XAMPP find this website. Moving the project folder to `<XAMPP_root_path>/htdocs/CS355GroupProject` or by creating a soft link from `<XAMPP_root_path>/htdocs/soft_link` to a folder location somewhere else on your system.
* Option 1: Moving this project folder to XAMPP: XAMPP needs to be able to find this project. By default, XAMPP searches in <XAMPP_root_path>/htdocs . Within htdocs, you'll need to place this project "CS268GroupProject" so that the file structure looks like `<XAMPP_root_path>/htdocs/CS355GroupProject`. Once that is done, you must navigate to the website by going to `localhost/CS355GroupProject`.
* Option 2: Soft link creation: I recommend that we instead create soft link from inside the htdocs directory. You can create a soft link that points to another location on your system where you have this project. This soft link can be named whatever you wish, and the soft link name will be used to navigate to this website. The soft link file structure looks like `<XAMPP_root_path>/htdocs/soft_link_name` and can used in a web browser. e.g. `localhost/soft_link_name`. If you don't know how to create a soft link, use a guide for your specific operating system. Nevertheless, you must create a soft link from inside XAMPP's `htdocs` directory to this project's root directory. Once that is done, you can navigate to the website by going to `localhost/soft_link_name`. 
    * Here in an example command for soft link creation for UNIX-based operating systems. `ln -s <this_project_path/CS355GroupProject> <XAMPP_root_path>/htdocs/soft_link_name`. By doing this, you can navigate to the website by using the soft link name. e.g. `localhost/soft_link_name`.

## Visual Studio Code Development Setup
The recommended IDE for this project's development is Visual Studio Code. If you don't know how to install VSCode, find a guide on the internet for your operating system. Using VSCode, feel free to open the CS355GroupProject folder that you cloned. Once VSCode is installed, install the recommended extensions.
* Code Spell Checker
    * Simple spell checking added to VSCode. Nice and convenient, but not needed.
* IntelliCode
* npm Intellisense
    * Allows the use of locally installed npm packages for autocomplete and suggesions as you type
* Path Intellisense
    * Tries to autocomplete filesystem paths for you
* Live Server
    * Very useful for speeding up workflow. e.g. Opening `index.html` as a Live Server through VSCode allows you to see changes as you save your files, instead of having to reload the webpage

## Using Phaser with VSCode
[Phaser](https://phaser.io/) is the JavaScript game development library of choice for this project. There are two ways you can use Phaser, and you should use both simultaneously when developing.
* Import the CDN in the header of the HTML. Minimum version for this project is Phaser 3.70: https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js
    * This is quick and easy, and needed if you want to actually present this project as a standalone website
* Install Phaser node modules from the npm package manager.
    * This is a little more involved, but absolutely required for speeding up workflow. See next section for install instructions
 
## Setting up Phaser Autocomplete and Suggesions in VSCode
In order to get autocomplete working in VSCode, you must first install the NPM package manager for your system.
* Windows: https://nodejs.org/en/download/
* Mac: https://nodejs.org/en/download/
* Arch Linux: sudo pacman -S npm

Once installed, open VSCode. Next, open a terminal inside VSCode
* Terminal → New Terminal
* Initialize npm
    * `npm init` 
    * You can answer these questions how you like. You can leave them as the defaults/blank if you don’t know what to put.
* Then, you can actually install Phaser through npm
    * `npm install phaser`
* Note that autocomplete will only work inside standalone JavaScript files. Writing JavaScript embedded in HTML files will not present you with suggestions.
