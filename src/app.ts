(global as any).Config = require('./config/config.json');
(global as any).p2 = require('p2');
(global as any).PIXI = require('pixi');
(global as any).Phaser = require('phaser');
let arrayFrom = require('./utils/array.from.js');
import * as protobuf from 'protobufjs';
(global as any).Protocol = protobuf.Root.fromJSON(require('./protocol/protocol.json'));
import * as WebFontLoader from 'webfontloader';

import Boot from './states/boot';
import Preloader from './states/preloader';
import Connection from './states/connection';
import Game from './states/game';
import Crash from './states/crash';
import Full from './states/full';
import Kicked from './states/kicked';

import * as $ from "jquery";

import * as Utils from './utils/utils';
import * as Assets from './assets';
import CookieReader from './utils/cookiereader';

class App extends Phaser.Game {
    constructor(config: Phaser.IGameConfig) {
        super (config);

        this.state.add('boot', Boot);
        this.state.add('preloader', Preloader);
        this.state.add('connection', Connection);
        this.state.add('game', Game);
        this.state.add('crash', Crash);
        this.state.add('full', Full);
        this.state.add('kicked', Kicked);

        this.state.start('boot');
    }
}

function startApp(): void {
    let gameWidth: number = DEFAULT_GAME_WIDTH;
    let gameHeight: number = DEFAULT_GAME_HEIGHT;

    // There are a few more options you can set if needed, just take a look at Phaser.IGameCongig
    let gameConfig: Phaser.IGameConfig = {
        width: gameWidth,
        height: gameHeight,
        renderer: Phaser.AUTO,
        antialias: true,
        resolution: 1
    };

    let app = new App(gameConfig);
}

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

window.onload = () => {
    let webFontLoaderOptions: any = null;
    let webFontsToLoad: string[] = GOOGLE_WEB_FONTS;

    if (webFontsToLoad.length > 0) {
        webFontLoaderOptions = (webFontLoaderOptions || {});

        webFontLoaderOptions.google = {
            families: webFontsToLoad
        };
    }

    if (Object.keys(Assets.CustomWebFonts).length > 0) {
        webFontLoaderOptions = (webFontLoaderOptions || {});

        webFontLoaderOptions.custom = {
            families: [],
            urls: []
        };

        for (let font in Assets.CustomWebFonts) {
            webFontLoaderOptions.custom.families.push(Assets.CustomWebFonts[font].getFamily());
            webFontLoaderOptions.custom.urls.push(Assets.CustomWebFonts[font].getCSS());
        }
    }

    let youtubers = ["UCxwNOfyNeepb-ltHx4zPAdA",
        "UC64R30QVnhyM1DNaXdzrHxQ",
        "UCMf65CSde0GZulPmD7nU4bg",
        "UC-wxm3EEFILAjkLLcckvIIA",
        "UCmSUz2Xqyw2Xfb5rSIOgNwQ",
        "UCVLo9brXBWrCttMaGzvm0-Q",
        "UCH0-0_0XNqkg8dTLYtFaWRg"
    ];

    let motdlist = [
        "If you are a Youtuber, simply follow \"For Youtubers\" link at the bottom of the page!",
        "If you have any suggestions or ideas regarding the game, please let us know!",
        "Finding a pig with a saddle is a great luck!",
        "You need to build more towers to stay on top of the leaderboard!",
        "Invite your friends using \"Create party link\" at the bottom of the page in order to play together!",
        "Nothing ventured, nothing gained.",
        "Are you going to attack the enemy? Don't forget to leave guards in the castle!",
        "If you need a lot of food, make beds as soon as possible!",
        "You can block enemy doors by building your walls nearby.",
        "The number of wall blocks is limited, but you can save some by building a castle near the border of the world.",
        "When attacking the enemy, you can create your guards next to him.",
        "If your mercenaries are killed during the battle, you can instantly create new ones. Make sure you always have enough food for it.",
        "Take good care of your peasants since higher-level units extract more resources.",
        "The stone of life saves you life, but you lose all the resources you have collected.",
        "If you died and used the stone of life, do not forget to build a new one!",
        "After defeating your enemy, you will get a quarter of all his resources, including gold.",
        "Sometimes the best defense is a good offense!",
        "The battle for glory has begun!"
    ];

    let ytid = youtubers[Math.floor(Math.random() * youtubers.length)];
    let yt: HTMLElement = document.createElement('div');
    yt.innerHTML = `<div class="g-ytsubscribe" id="ytbutton" data-channelid="${ytid}" data-layout="full" data-theme="dark" data-count="default"></div>`;
    document.getElementById('featuredyoutuber').appendChild(yt);    
    let script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    document.body.appendChild(script);
    
    let motd = document.getElementById('motd');
    let motdContainer = document.getElementById('motdcontent');    
    let motdText = motdlist[Math.floor(Math.random() * motdlist.length)];
    if (motdText) {
        motdContainer.innerText = motdText;
        motd.style.display = 'block';
    }

    if (webFontLoaderOptions === null) {
        // Just start the game, we don't need any additional fonts
        startApp();
    } else {
        // Load the fonts defined in webFontsToLoad from Google Web Fonts, and/or any Local Fonts then start the game knowing the fonts are available
        webFontLoaderOptions.active = startApp;

        WebFontLoader.load(webFontLoaderOptions);
    }
};
