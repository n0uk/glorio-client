import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import Message = Protocol.Message;

export default class LeaderboardService extends Service {
    private container: HTMLElement;

    constructor(world: Game) {
        super(world);
        this.container = document.getElementById('leaderboard');

    }

    public onScoreMessage(message: Message) {
        let innerHTML: Array<string> = [];
        let score_data: Array<number> = message.content['scoreData'];
        let name_data: Array<string> = message.content['nameData'];
        for (let i = 0; i < score_data.length; i++) {
            innerHTML.push(this.format(i + 1, name_data[i], score_data[i]));
        }
        this.container.innerHTML = innerHTML.join('');

        this.toggle(score_data.length > 0);
    }

    private toggle(flag: boolean) {
        this.container.style.visibility = flag ? 'visible' : 'hidden';
    }

    private format(num: number, nickname: string, score: number): string {
        return `
        <div class="record">
            <div class="nickname">${num}. ${nickname}</div><div class="score">${score}</div>
        </div>
        `;
    }
}