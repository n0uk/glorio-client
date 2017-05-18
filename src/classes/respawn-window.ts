import AdController from '../classes/adcontroller.ts';

export default class RespawnWindow {
    private window: HTMLElement;
    private button: HTMLElement;
    private ad: HTMLElement;
    private interval: any;
    private seconds: number;
    private state: any;
    
    constructor(state) {
        let self = this;
        this.state = state;
        this.window = document.getElementById('respawn-window');
        this.button = document.getElementById('respawn-button');
        this.ad = document.getElementById('respawn-ad');
        this.button.onclick = function () {
            self.requestRespawn();
        };
    }
    
    private requestRespawn() {
        if (this.seconds < 1) {
            this.stop();
            let self = this;
            AdController.play(function () {
                self.state.request_respawn();
            });
        }
    }
    
    public show () {
        this.state.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
            this.reallyShow();
        }, this);
        this.state.game.time.events.add(Phaser.Timer.SECOND * 3, function () {
            this.ad.style.display = 'block';
        }, this);        
    }
    
    private reallyShow() {
        let self = this;
        this.window.style.display = 'block';
        this.button.className = 'inactive';
        this.seconds = 5;
        this.button.innerText = `Spawn in ${this.seconds} seconds..`;
        this.interval = setInterval(function () {
            self.update();
        }, 1000);
    }
    
    private update() {
        this.seconds -= 1;
        if (this.seconds < 1) {
            clearInterval(this.interval);
            this.button.innerText = 'Spawn';
            this.button.className = 'active';
        } else {
            this.button.innerText = `Spawn in ${this.seconds} seconds..`;
        }
    }
    
    public stop() {
        this.ad.style.display = 'none';
        this.window.style.display = 'none';
    }
}