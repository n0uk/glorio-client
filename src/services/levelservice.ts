import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import Message = Protocol.Message;
import EntityType = Protocol.EntityType;

export default class LevelService extends Service {
    private levelText: HTMLElement;
    private levelProgressBody: HTMLElement;

    constructor(world: Game) {
        super(world);
        this.levelText = document.getElementById('ui-stats-level-text');
        this.levelText.innerText = 'Level 1';
        this.levelProgressBody = document.getElementById('ui-level-bar');
    }

    public setLevel(level) {
        this.levelText.innerText = `Level ${level + 1}`;
    }

    public setProgress(progress) {
        let percents = Math.round(progress * 100);
        if (percents > 100) {
            percents = 100;
        }
        this.levelProgressBody.style.width = `${percents}%`;
    }

    public destroy() {
        super.destroy();
    }
}