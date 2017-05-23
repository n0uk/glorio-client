export default class Leaderboard {
    private div: HTMLElement;
    private isVisible: boolean = false;
    
    getstring(num, nickname, score): string {
        return `
        <div class="record">
            <div class="nickname">${num}. ${nickname}</div><div class="score">${score}</div>
        </div>
        `;
    }
    
    constructor() {
        this.div = document.getElementById('leaderboard');
    }
    
    update(scoredata) {
        let text: string = '';
        for (let i = 0; i < scoredata.length; i++) {
            let part: string = this.getstring(i + 1, scoredata[i].name, scoredata[i].score);
            text = text + part;
        }
        this.div.innerHTML = text;
        
        if (scoredata.length > 0 && !this.isVisible) {
            this.show();
        } else if (scoredata.length === 0 && this.isVisible) {
            this.hide();
        }
    }
    
    show() {
        this.div.style.display = 'block';
        this.isVisible = true;
    }
    
    hide() {
        this.div.style.display = 'none';
        this.isVisible = false;
    }
}