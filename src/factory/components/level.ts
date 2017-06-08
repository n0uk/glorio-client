import {Component} from "../entity";
import {Protocol} from "../../protocol/protocol";
import {Message} from "protobufjs";
import SpriteComponent from "./sprite";
import LevelService from "../../services/levelservice";
import HatComponent from "./hat";

export default class LevelComponent extends Component {
    public id: string = 'level';
    public currentLevel: number = 0;

    protected levelService: LevelService;

    constructor() {
        super();
    }

    public start() {
        this.entity.on('networksync', this.onNetworkSync.bind(this));
        this.updateLevel(0);
        this.levelService = this.world.services.getService(LevelService) as LevelService;
    }

    private onNetworkSync(message: Message) {
        if (message.hasOwnProperty('level')) {
            this.updateLevel(message['level']);
            if (this.entity.isLocalPlayer()) {
                this.levelService.setLevel(message['level']);
            }
        }
        if (message.hasOwnProperty('exp')) {
            if (this.entity.isLocalPlayer()) {
                this.levelService.setProgress(message['exp']);
            }
        }
    }

    private updateLevel(level: number) {
        this.currentLevel = level;
        let scale = Phaser.Math.clamp(0.6 + level / 50, 0.6, 1.2);
        (this.entity.components.sprite as SpriteComponent).sprite.scale.set(scale, scale);
        let hatComponent = (this.entity.components.hat as HatComponent);
        if (hatComponent) {
            hatComponent.setScale(scale);
        }
    }
}