import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import Message = Protocol.Message;
import EntityType = Protocol.EntityType;

export default class LevelService extends Service {
    private levelText: HTMLElement;
    private levelProgressBody: HTMLElement;
    private levelContainer: HTMLElement;

    constructor(world: Game) {
        super(world);
        this.levelText = document.getElementById('levelText');
        this.levelText.innerText = 'Level 1';
        this.levelProgressBody = document.getElementById('levelProgressBody');
        this.levelContainer = document.getElementById('levelProgressContainer');
        this.toggle(true);
    }

    public toggle(flag: boolean) {
        this.levelText.style.visibility = flag ? 'visible' : 'hidden';
        this.levelContainer.style.visibility = flag ? 'visible' : 'hidden';
    }

    public setLevel(level) {
        this.levelText.innerText = `Level ${level + 1}`;
    }

    public setProgress(progress) {
        this.levelProgressBody.style.width = `${Math.round(progress * 100)}%`;
    }

    public destroy() {
        super.destroy();
        this.toggle(false);
    }
}