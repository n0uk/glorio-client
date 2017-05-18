import {Component} from '../entity';

export default class TransformComponent extends Component {
    public position: Phaser.Point = new Phaser.Point();
    public rotation: number = 0;
    public id: string  = "transform";

    private previousPosition: Phaser.Point = new Phaser.Point();
    private stayTime: number = 0;
    
    constructor(position?: Phaser.Point, rotation?: number) {
        super();
        if (position) {
            this.position.copyFrom(position);
        }
        if (rotation) {
            this.rotation = rotation;
        }
    }

    public update(dt: number) {
        if (!this.position.equals(this.previousPosition)) {
            this.stayTime = 0;
        } else {
            this.stayTime += dt;
        }
        this.previousPosition.copyFrom(this.position);
    }

    public isMoving(): boolean {
        return this.stayTime < 0.2;
    }
}