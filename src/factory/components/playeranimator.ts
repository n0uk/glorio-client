import AnimatorComponent from "./animator";
import {Message} from "protobufjs";

export default class PlayerAnimatorComponent extends AnimatorComponent {

    private transportId: number = -1;

    constructor() {
        super();
    }

    public start() {
        super.start();
        this.entity.on('networksync', this.onNetworkSync.bind(this));
        this.entity.on('senddamage', this.onSendDamage.bind(this));

        this.addAnimation('walk', Phaser.Animation.generateFrameNames('walk', 1, 16, '.png', 0), 30, true);
        this.addAnimation('pigwalk', ['onpig.png'], 15, true);
        this.addAnimation('punch', Phaser.Animation.generateFrameNames('hit', 1, 10, '.png', 0), 40, false).onComplete.add(function () {
            this.walk();
        }.bind(this));
        this.addAnimation('pigpunch', Phaser.Animation.generateFrameNames('pighit', 1, 8, '.png', 0), 30, false).onComplete.add(function () {
            this.walk();
        }.bind(this));

        this.walk();
    }

    private onNetworkSync(message: Message) {
        if (message.hasOwnProperty('transportId')) {
            this.transportId = message['transportId'];
        }
    }

    private walk() {
        if (this.transportId > -1) {
            this.play('pigwalk');
        } else {
            this.play('walk');
        }
    }

    private onSendDamage() {
        if (this.transportId > -1) {
            this.play('pigpunch');
        } else {
            this.play('punch');
        }

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