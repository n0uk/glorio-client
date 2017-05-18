import AnimatorComponent from "./animator";

export default class AngryAnimalAnimatorComponent extends AnimatorComponent {

    constructor() {
        super();
    }

    public start() {
        super.start();
        this.entity.on('senddamage', this.onSendDamage.bind(this));
        this.addAnimation('walk', Phaser.Animation.generateFrameNames('walk', 1, 8, '.png', 0), 15, true);
        this.addAnimation('punch', Phaser.Animation.generateFrameNames('hit', 1, 8, '.png', 0), 30, false).onComplete.add(function () {
            this.walk();
        }.bind(this));

        this.walk();
    }

    private walk() {
        this.play('walk');
    }

    private onSendDamage() {
        this.play('punch');
    }

    public update(dt: number) {
        super.update(dt);
        if (this.getCurrentName() !== 'punch' && this.getCurrentName() !== 'pigpunch') {
            if (this.cachedTransform.isMoving()) {
                this.walk();
            } else {
                this.cachedSpriteComponent.sprite.animations.stop();
            }
        }
    }

    public destroy() {
    }
}