import {Component} from "../entity";
import {Message} from "protobufjs";
import SpriteComponent from "./sprite";
import TransformComponent from "./transform";
import * as Assets from '../../assets';

export default class TeamLabelComponent extends Component {
    public id = "teamlabel";

    protected label;
    protected labelColor = '#ffffff';
    protected cachedTransform: TransformComponent;
    protected cachedSprite: SpriteComponent;
    protected offset: number;
    protected teamName: string;
    protected crownImage: Phaser.Image;

    private isAdmin: boolean = false;

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

        this.crownImage = this.world.make.image(this.cachedTransform.position.x,
            this.cachedTransform.position.y + this.offset - this.cachedSprite.sprite.height / 2,
            Assets.Images.ImagesCrown.getName());
        this.crownImage.anchor.set(0.5, 0.5);
    }

    public setTeamName(teamName: string) {
        this.teamName = teamName;
        this.label.setText(this.teamName);
    }

    public setColor(color) {
        this.labelColor = color;
        this.label.fill = this.labelColor;
    }

    protected align() {
        let x = this.cachedTransform.position.x;
        let y = this.cachedTransform.position.y + this.offset - this.cachedSprite.sprite.height / 2;
        this.label.position.set(x, y);
        this.crownImage.position.set(x, y - 40);
    }

    private onNetworkSync(message: Message) {
        let updated = false;
        if (message.hasOwnProperty('teamName')) {
            this.teamName = message['teamName'];
            updated = true;
        }

        if (message.hasOwnProperty('isTeamAdmin')) {
            this.isAdmin = message['isTeamAdmin'];
            updated = true;
        }

        if (updated) {
            if (this.teamName) {
                this.label.setText('[' + this.teamName + ']');
            } else {
                this.label.setText('');
            }

            if (this.isAdmin) {
                if (!this.crownImage.inWorld) {
                    this.world.LAYER_UI.add(this.crownImage);
                }
            } else {
                if (this.crownImage.inWorld) {
                    this.crownImage.parent.removeChild(this.crownImage);
                }
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