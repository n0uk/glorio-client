import {Component} from "../entity";
import SpriteComponent from "./sprite";
import TransformComponent from "./transform";

export default class AnimatorComponent extends Component {
    public id: string = "animator";

    protected cachedSpriteComponent: SpriteComponent;
    protected cachedTransform: TransformComponent;

    constructor() {
        super();
    }

    public start() {
        this.cachedSpriteComponent = this.entity.components.sprite as SpriteComponent;
        this.cachedTransform = this.entity.components.transform as TransformComponent;
    }

    public addAnimation(name: string, frames: string[], fps: number, loop: boolean = false): Phaser.Animation {
        return this.cachedSpriteComponent.sprite.animations.add(name, frames, fps, loop);
    }

    public play(name: string) {
        this.cachedSpriteComponent.sprite.animations.play(name);
    }

    public getCurrentName(): string {
        return this.cachedSpriteComponent.sprite.animations.name;
    }
}