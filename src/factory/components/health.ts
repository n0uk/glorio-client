import {Component} from "../entity";
import {Protocol} from "../../protocol/protocol";
import {Message} from "protobufjs";
import SpriteComponent from "./sprite";
import TransformComponent from "./transform";

export class Healthbar {
    private current: Phaser.Sprite;
    private total: Phaser.Sprite;
    private group: Phaser.Group;
    private game: Phaser.Game;
    private croprect: Phaser.Rectangle;
    private totalcrop: number;
    private bitmap1: Phaser.BitmapData;
    private bitmap2: Phaser.BitmapData;
    private width: number = 120;
    private height: number = 10;
    private borderwidth: number = 1;
    private borderheight: number = 1;
    private bgcolor: string = '#ffffff';
    private fgcolor: string = '#aa0000';
    private offset: number = 10;
    private alpha: number = 0.5;

    constructor(game: Phaser.Game, group: Phaser.Group, x: number, y: number) {
        this.game = game;
        this.group = group;

        let bitmap: Phaser.BitmapData = this.game.add.bitmapData(this.width, this.height);

        bitmap.ctx.beginPath();
        bitmap.ctx.rect(0, 0, this.width, this.height);
        bitmap.ctx.fillStyle = this.bgcolor;
        bitmap.ctx.fill();

        this.bitmap1 = bitmap;

        this.total = group.create(x, y, bitmap);
        this.total.alpha = this.alpha;
        this.total.anchor.set(0.5, 0.5);

        bitmap = this.game.add.bitmapData(this.width - this.borderwidth * 2, this.height - this.borderheight * 2);
        bitmap.ctx.beginPath();
        bitmap.ctx.rect(0, 0, this.width - this.borderwidth * 2, this.height - this.borderheight * 2);
        bitmap.ctx.fillStyle = this.fgcolor;
        bitmap.ctx.fill();

        this.bitmap2 = bitmap;

        this.current = group.create(x, y, bitmap);
        this.current.alpha = this.alpha;
        this.current.anchor.set(0, 0.5);

        this.croprect = new Phaser.Rectangle(0, 0, bitmap.width, bitmap.height);
        this.totalcrop = bitmap.width;

        this.current.cropRect = this.croprect;
    }

    public setposition(x: number, y: number) {
        this.current.position.x = x - this.totalcrop / 2;
        this.current.position.y = y + this.height / 2 + this.offset;
        this.total.position.x = x;
        this.total.position.y = y + this.height / 2 + this.offset;
    }

    public fill(value: number) {
        this.croprect.width = value * this.totalcrop;
        this.current.updateCrop();
    }

    public destroy() {
        this.current.destroy();
        this.total.destroy();
        this.bitmap1.destroy();
        this.bitmap2.destroy();
    }
}

export default class HealthComponent extends Component {

    private bar: Healthbar;
    private cachedTransform: TransformComponent;
    private cachedSprite: SpriteComponent;
    private health: number = 1;
    private maxHealth: number = 1;
    private offset: number;

    constructor(offset: number = 0) {
        super();
        this.offset = offset;
    }

    public start() {
        this.cachedTransform = this.entity.components.transform as TransformComponent;
        this.cachedSprite = this.entity.components.sprite as SpriteComponent;

        this.bar = new Healthbar(this.world.game, this.world.LAYER_UI, this.cachedTransform.position.x, this.cachedTransform.position.y);
        this.bar.fill(1);

        this.entity.on('networksync', this.onNetworkSync.bind(this));
    }

    private onNetworkSync(message: Message) {
        if (message.hasOwnProperty('health')) {
            this.health = message['health'];
        }
        if (message.hasOwnProperty('maxHealth')) {
            this.maxHealth = message['maxHealth'];
        }
        this.bar.fill(this.health / this.maxHealth);
    }

    public update(dt: number) {
            let x = this.cachedTransform.position.x;
            let y = this.cachedTransform.position.y - this.offset + this.cachedSprite.sprite.height / 2;
            this.bar.setposition(x, y);
    }

    public destroy() {
        this.bar.destroy();
    }
}