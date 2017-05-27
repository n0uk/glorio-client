import {Component} from '../entity';
import {Message} from "protobufjs";
import TransformComponent from "./transform";
import {RotationInterpolator} from "./networktransform";

export default class LocalRotationInputComponent extends Component {
    public id: string = "localrotationinput";

    private cachedTransform: TransformComponent;
    private latestPunchRotation: number;
    private lockTimeout: number = 0;

    constructor() {
        super();
    }

    public start() {
        this.cachedTransform = this.entity.components.transform as TransformComponent;
        this.entity.on('senddamage', this.onSendDamage.bind(this));
    }

    private onSendDamage(message: Message) {
        this.lockTimeout = 0.5;
        this.latestPunchRotation = Phaser.Math.angleBetween(
            0,
            0,
            message['directionX'],
            message['directionY'])
            + Phaser.Math.degToRad(90);
    }

    public update(dt: number) {
        if (this.lockTimeout > 0) {
            this.lockTimeout -= dt;
            this.cachedTransform.rotation = this.latestPunchRotation;
        } else {
            let rotation: number = Phaser.Math.angleBetween(
                0,
                0,
                this.world.game.input.activePointer.worldX - this.cachedTransform.position.x,
                this.world.game.input.activePointer.worldY - this.cachedTransform.position.y);

            rotation += Phaser.Math.degToRad(90);
            rotation = parseFloat(rotation.toPrecision(2));

            this.cachedTransform.rotation = RotationInterpolator.interpolateAngle(this.cachedTransform.rotation, rotation, 12 * dt);
        }
    }

    public destroy() {
       
    }
}