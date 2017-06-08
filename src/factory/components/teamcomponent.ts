import {Component} from "../entity";
import {Message} from "protobufjs";
import SpriteComponent from "./sprite";
import PlayerLabelComponent from "./playerlabel";
import TeamLabelComponent from "./teamlabel";
import HatComponent from "./hat";

export default class TeamComponent extends Component {

    public id: string = "teamcomponent";

    public networkId: number;
    public teamId: number;
    public teamName: string;
    public isAdmin: boolean = false;

    private cachedSpriteComponent: SpriteComponent;
    private cachedLabelComponent: PlayerLabelComponent;
    private cachedLabelTeamComponent: TeamLabelComponent;
    private cachedHatComponent: HatComponent;

    constructor() {
        super();
    }

    public start() {
        this.cachedSpriteComponent = this.entity.components.sprite as SpriteComponent;
        this.cachedLabelComponent = this.entity.components.label as PlayerLabelComponent;
        this.cachedLabelTeamComponent = this.entity.components.teamlabel as TeamLabelComponent;
        this.cachedHatComponent = this.entity.components.hat as HatComponent;

        this.entity.on('networksync', this.onNetworkSync.bind(this));
        this.entity.on('hostspawn', this.updateTeamBehavior.bind(this));
        this.entity.on('hostteamchanged', this.updateTeamBehavior.bind(this));
    }

    private onNetworkSync(message: Message) {
        let changed: boolean = false;

        if (message.hasOwnProperty('networkId')) {
            this.networkId = message['networkId'];
            changed = true;
        }
        if (message.hasOwnProperty('teamId')) {
            this.teamId = message['teamId'];
            changed = true;
        }
        if (message.hasOwnProperty('teamName')) {
            this.teamName = message['teamName'];
            changed = true;
        }
        if (message.hasOwnProperty('isTeamAdmin')) {
            this.isAdmin = message['isTeamAdmin'];
            changed = true;
        }

        if (changed) {
            this.updateTeamBehavior();
        }
    }

    public isFriend(networkId: number, teamId: number): boolean {
        return networkId === this.world.networkId || (teamId > -1 && teamId === this.world.teamId);
    }

    private updateTeamBehavior() {
        let isFriend = this.isFriend(this.networkId, this.teamId);

        if (this.cachedSpriteComponent) {
            this.cachedSpriteComponent.setColor(isFriend ? 0xffffff : 0xffaaaa);
        }
        if (this.cachedLabelComponent) {
            this.cachedLabelComponent.setColor(isFriend ? '#ffffff' : '#ff9999');
        }
        if (this.cachedLabelTeamComponent) {
            this.cachedLabelTeamComponent.setColor(isFriend ? '#ffffff' : '#ff9999');
        }
        if (this.cachedHatComponent) {
            this.cachedHatComponent.setColor(isFriend ? 0xffffff : 0xffeeee);
        }
    }
}