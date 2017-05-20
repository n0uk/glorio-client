import {Component} from "../entity";
import {Message} from "protobufjs";
import SpriteComponent from "./sprite";
import TransformComponent from "./transform";
import * as Assets from '../../assets';

export default class PlayerLabelComponent extends Component {
    public id = "label";

    protected label;
    protected labelColor = '#ffffff';
    protected cachedTransform: TransformComponent;
    protected cachedSprite: SpriteComponent;
    protected offset: number;
    protected playerName: string;
    protected level: number;

    constructor(offset: number) {
        super();
        this.offset = offset;
    }

    public start() {
        this.entity.on('networksync', this.onNetworkSync.bind(this));
        this.cachedTransform = this.entity.components.transform as TransformComponent;
        this.cachedSprite = this.entity.components.sprite as SpriteComponent;

        this.label = this.world.game.add.text(this.cachedTransform.position.x, this.cachedTransform.position.y + this.offset - this.cachedSprite.sprite.height / 2, "", {
            fontSize: '18px',
            font: 'Roboto Mono'
        });
        this.label.anchor.set(0.5, 1);
        // Stroke color and thickness
        this.label.stroke = 'rgba(0,0,0,0.7)';
        this.label.strokeThickness = 3;
        this.label.fill = this.labelColor;

    }

    public setPlayerName(playerName: string) {
        this.playerName = playerName;
        if (this.level > 0) {
            this.label.setText(`${this.playerName} (${this.level + 1})`);
        } else {
            this.label.setText(`${this.playerName}`);
        }
    }

    public setColor(color) {
        this.labelColor = color;
        this.label.fill = this.labelColor;
    }

    protected align() {
        let x = this.cachedTransform.position.x;
        let y = this.cachedTransform.position.y + this.offset - this.cachedSprite.sprite.height / 2;
        this.label.position.set(x, y);
    }

    private onNetworkSync(message: Message) {
        let updated = false;
        if (message.hasOwnProperty('level')) {
            this.level = message['level'];
            updated = true;
        }
        if (message.hasOwnProperty('playerName') && message['playerName']) {
            this.playerName = message['playerName'];
            updated = true;
        }

        if (updated) {
            if (this.level > 0) {
                this.label.setText(`${this.playerName} (${this.level + 1})`);
            } else {
                this.label.setText(`${this.playerName}`);
            }
        }
    }

    public update(dt: number) {
        this.align();
    }

    public destroy() {
        this.label.destroy();
    }
}