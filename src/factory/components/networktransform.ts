import { Component } from '../entity';
import TransformComponent from './transform';
import {Message} from "protobufjs";
import PingService from "../../services/pingservice";

export class RotationInterpolator {
    private serverRotation: number = 0;
    private clientRotation: number = 0;
    private updateTime: number = 0;

    private interpolationTime: number = 0.100;

    constructor() {

    }

    public updateFrame(currentRotation: number,
        serverRotation: number,
        currentTime: number) {
            this.serverRotation = serverRotation;
            this.clientRotation = currentRotation;
            this.updateTime = currentTime;
    }

    public static interpolateAngle(a1: number,
        a2: number,
        weight: number,
        radians: boolean = true): number {  
        // interpolated between angles (short leg, scaled to -180..180 / -PI..PI)
        let wrap: number = (radians) ? Math.PI : 180;

        if (Math.abs(a2 - a1) > wrap) {
            if (a2 > a1) {
                a1 += wrap * 2;
            } else {
                a2 += wrap * 2;
            }
        }


        let out: number = (a1 + ((a2 - a1) * weight));

        if (out >= 0 && out <= wrap * 2) { 
            return out; 
        }

        return (out % (wrap * 2));
    }

    public interpolate(currentTime: number, averagePing: number): number {
        let timeLeft: number = currentTime - this.updateTime;
        let lerpValue: number = timeLeft / (this.interpolationTime + averagePing / 2);
        lerpValue = Phaser.Math.clamp(lerpValue, 0, 1);
        return RotationInterpolator.interpolateAngle(this.clientRotation, this.serverRotation, lerpValue);
    }
}

export class PositionInterpolator {
    private serverPosition: Phaser.Point = new Phaser.Point();
    private clientPosition: Phaser.Point = new Phaser.Point();
    private updateTime: number = 0;

    private forceTeleportDistance = 500;
    private interpolationTime: number = 0.100;

    constructor() {

    }

    public updateFrame(currentPosition: Phaser.Point,
        serverPosition: Phaser.Point,
        currentTime: number) {
        this.serverPosition.copyFrom(serverPosition);
        this.clientPosition.copyFrom(currentPosition);
        this.updateTime = currentTime;
    }

    public interpolate(source: Phaser.Point, currentTime: number, averagePing: number) {
        if (this.clientPosition.distance(this.serverPosition) < this.forceTeleportDistance) {
            // Interpolate
            let timeLeft: number = currentTime - this.updateTime;
            let lerpValue: number = timeLeft / (this.interpolationTime + averagePing / 2);
            lerpValue = Phaser.Math.clamp(lerpValue, 0, 1);
            Phaser.Point.interpolate(this.clientPosition,
                this.serverPosition,
                lerpValue,
                source);
        } else {
            // Just replace values
            source.set(this.serverPosition.x, this.serverPosition.y);
        }
    }
}

export default class NetworkTransformComponent extends Component {
    public id: string = 'networktransform';
    
    private cachedTransform: TransformComponent;
    private cachedPingService: PingService;
    private rotationInterpolator: RotationInterpolator = new RotationInterpolator();
    private positionInterpolator: PositionInterpolator = new PositionInterpolator();

    private tmpNetworkPoint: Phaser.Point = new Phaser.Point();

    public interpolateRotation: boolean = true;
    public interpolatePosition: boolean = true;

    constructor(interpolatePosition: boolean = true, interpolateRotation: boolean = true) {
        super();
        this.interpolateRotation = interpolateRotation;
        this.interpolatePosition = interpolatePosition;
    }

    public start() {
        super.start();
        this.cachedTransform = this.entity.components.transform as TransformComponent;
        this.cachedPingService = this.world.services.getService(PingService) as PingService;
        this.entity.on('networksync', this.onNetworkSync.bind(this));
    }

    private onNetworkSync(message: Message) {
        if (message.hasOwnProperty('x')) {
            if (this.interpolatePosition) {
                this.tmpNetworkPoint.set(message['x'], message['y']);
                this.positionInterpolator.updateFrame(
                    this.cachedTransform.position,
                    this.tmpNetworkPoint,
                    this.world.game.time.totalElapsedSeconds()
                );
            }
        }

        if (message.hasOwnProperty('rotation')) {
            if (this.interpolateRotation) {
                this.rotationInterpolator.updateFrame(
                    this.cachedTransform.rotation,
                    message['rotation'],
                    this.world.game.time.totalElapsedSeconds()
                );
            }
        }
    }

    public update(dt: number) {
        if (this.interpolatePosition) {
            this.positionInterpolator.interpolate(
                this.cachedTransform.position,
                this.world.game.time.totalElapsedSeconds(),
                this.cachedPingService.getAveragePing());
        }
        if (this.interpolateRotation) {
            this.cachedTransform.rotation = this.rotationInterpolator.interpolate(
                this.world.game.time.totalElapsedSeconds(),
                this.cachedPingService.getAveragePing());
        }
    }
}