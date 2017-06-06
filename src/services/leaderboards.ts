import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import Message = Protocol.Message;
import {escapeHtml} from "../utils/escape";

export default class LeaderboardService extends Service {
    private container: HTMLElement;

    private latestLeaderboardMessage: any;
    public topId: number = -1;

    private currentRank: number;
    private currentScore: number;
    private currentName: string;

    constructor(world: Game) {
        super(world);
        this.container = document.getElementById('leaderboard');

    }

    public onScoreMessagePlayer(message: Message) {
        this.currentName = message.content['name'];
        this.currentRank = message.content['rank'];
        this.currentScore = message.content['score'];
    }

    public onScoreMessage(message: Message) {
        this.latestLeaderboardMessage = message.content;

        let innerHTML: Array<string> = [];

        let score_data: Array<number> = message.content['scoreData'];
        let name_data: Array<string> = message.content['nameData'];
        let id_data: Array<number> = message.content['idData'];
        let teamId_data: Array<number> = message.content['teamData'];
        // message.content['teamNameData'] - team names ("" for non-teamed);

        if (id_data.length > 0) {
            this.topId = id_data[0];
        }

        for (let i = 0; i < score_data.length; i++) {
            innerHTML.push(this.format(i + 1, name_data[i], score_data[i], id_data[i] === this.world.id, teamId_data[i] > -1 && teamId_data[i] === this.world.teamId));
        }
        if (this.currentRank > 9) {
            innerHTML.push(this.format(this.currentRank + 1, this.currentName, this.currentScore, true, true));
        }
        this.container.innerHTML = `
        <div class="ui-leaderboard-player is-header">
            <span class="player-rank">Rank</span>
            <span class="player-name">Name</span>
            <span class="player-score">Score</span>
        </div>        
        ${innerHTML.join('')}`;

        this.toggle(score_data.length > 0);
    }

    private toggle(flag: boolean) {
        this.container.style.visibility = flag ? 'visible' : 'hidden';
    }

    private format(num: number, nickname: string, score: number, isActive: boolean, isAlly: boolean): string {
        return `
        <div class="ui-leaderboard-player ${isActive ? "is-active" : isAlly ? "is-ally" : ""}">
            <span class="player-rank">#${num}</span>
            <span class="player-name">${escapeHtml(nickname)}</span>
            <span class="player-score">${score}</span>
        </div>
        `;
    }
}