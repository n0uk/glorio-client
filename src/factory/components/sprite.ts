import {Component} from '../entity';
import TransformComponent from './transform';

export default class SpriteComponent extends Component {

    private sync: boolean = true;

    public id: string = "sprite";
    public sprite: Phaser.Sprite;

    public color: number = 0xffffff;

    private cachedTransform: TransformComponent;

    constructor(layer: Phaser.Group, spriteName: string, center: Phaser.Point) {
        super();
        this.sprite = layer.create(0, 0, spriteName);
        this.sprite.anchor.copyFrom(center);
        this.sprite.smoothed = true;
    }

    public start() {
        this.cachedTransform = this.entity.components.transform as TransformComponent;
    }

    public update(dt: number) {
        if (this.sync) {
            this.sprite.position.copyFrom(this.cachedTransform.position);
            this.sprite.rotation = this.cachedTransform.rotation;
        }
    }

    public destroy() {
        this.sprite.destroy();
    }

    public jump(height: number) {
        this.sync = false;
        this.sprite.position.y -= height;
        let tween = this.world.game.add.tween(this.sprite);
        tween.to({y: this.sprite.position.y + 10}, 250);
        tween.onComplete.add(this.onJumpTweenComplete, this);
        tween.start();
    }

    public setColor(color) {
        this.color = color;
        this.sprite.tint = this.color;
    }

    public flashRed() {
        if (this.sprite) {
            this.sprite.tint = 0xff9999;
            this.world.game.time.events.add(Phaser.Timer.SECOND * 0.2, function () {
                if (this.sprite) {
                    this.sprite.tint = this.color;
                }
            }, this);
        }
    }

    private onJumpTweenComplete() {
        this.sync = true;
    }
}