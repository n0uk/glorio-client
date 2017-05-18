import Manager from './manager';
import Game from '../states/game';

export default class LevelDisplay extends Manager {
    private levelText: HTMLElement;
    private levelProgressBody: HTMLElement;
    private levelContainer: HTMLElement;
    
    constructor(state: Game) {
        super(state);
        this.levelText = document.getElementById('levelText');
        this.levelText.innerText = 'Level 1';
        this.levelProgressBody = document.getElementById('levelProgressBody');
        this.levelContainer = document.getElementById('levelProgressContainer');
        this.toggle(false);
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