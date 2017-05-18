import {Component} from "../entity";
import {Message} from "protobufjs";
import SpriteComponent from "./sprite";
import PlayerLabelComponent from "./playerlabel";

export default class TeamComponent extends Component {

    public teamId: string;

    private cachedSpriteComponent: SpriteComponent;
    private cachedLabelComponent: PlayerLabelComponent;

    constructor() {
        super();
    }

    public start() {
        this.cachedSpriteComponent = this.entity.components.sprite as SpriteComponent;
        this.cachedLabelComponent = this.entity.components.label as PlayerLabelComponent;
        this.entity.on('networksync', this.onNetworkSync.bind(this));
    }

    private onNetworkSync(message: Message) {
        if (message.hasOwnProperty('teamId')) {
            this.updateTeam(message['teamId']);
        }
    }

    private updateTeam(teamId: string) {
        this.teamId = teamId;
        if (this.cachedSpriteComponent) {
            this.cachedSpriteComponent.setColor(teamId === this.world.teamId ? 0xffffff : 0xffaaaa);
        }
        if (this.cachedLabelComponent) {
            this.cachedLabelComponent.setColor(teamId === this.world.teamId ? '#ffffff' : '#ff9999');
        }
    }
}