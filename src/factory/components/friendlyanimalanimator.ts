import AnimatorComponent from "./animator";

export default class FriendlyAnimalAnimatorComponent extends AnimatorComponent {

    constructor() {
        super();
    }

    public start() {
        super.start();
        this.addAnimation('walk', Phaser.Animation.generateFrameNames('walk', 1, 8, '.png', 0), 15, true);
        this.walk();
    }

    private walk() {
        this.play('walk');
    }

    public update(dt: number) {
        super.update(dt);
        if (this.cachedTransform.isMoving()) {
            this.walk();
        } else {
            this.cachedSpriteComponent.sprite.animations.stop();
        }
    }

    public destroy() {
    }
}