import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import ResourceType = Protocol.ResourceType;
import * as Assets from '../assets';
import MessageType = Protocol.MessageType;
import Message = Protocol.Message;
import NotifyService from "./notifyservice";

export default class DayTimeService extends Service {
    private filter: Phaser.Filter;
    public hour: number = 12;
    private latestDarkness: number = 0;

    public constructor(world: Game) {
        super(world);
        this.world.socket.onMessage(MessageType.DayTimeMessage,  this.onDayTimeMessage.bind(this));
        this.filter = new Phaser.Filter(this.world.game, null, `
            precision mediump float;
    
            varying vec2       vTextureCoord;
            varying vec4       vColor;
            uniform sampler2D  uSampler;
            uniform vec3       tint;
    
            void main(void) {
                gl_FragColor = texture2D(uSampler, vTextureCoord);
                gl_FragColor.rgb = vec3(gl_FragColor.r * tint.r, gl_FragColor.g * tint.g, gl_FragColor.b * tint.b);
            }
        `);
        this.filter.uniforms.tint = {type: '3f', value: {x: 0.5, y: 0.5, z: 0.7}};
        this.world.game.world.filters = [this.filter];
    }

    public isNight() {
        return (this.hour >= 23 || this.hour <= 4);
    }

    private getDarknessValue(hour: number) {
        let darknessValue: number = 0;
        if ((hour > 22 && hour < 23) || (hour > 4 && hour < 5)) {
            darknessValue = 0.5;
        } else if (hour >= 23 || hour <= 4) {
            darknessValue = 1;
        }
        return darknessValue;
    }

    public update(dt: number) {
        let darknessValue: number = this.getDarknessValue(this.hour);
        darknessValue = Phaser.Math.linear(this.latestDarkness, darknessValue, dt);
        this.latestDarkness = darknessValue;
        this.latestDarkness = Phaser.Math.clamp(this.latestDarkness, 0, 1);
        let brightness = {x: Phaser.Math.linear(1, 0.5, darknessValue),
            y: Phaser.Math.linear(1, 0.5, darknessValue),
            z: Phaser.Math.linear(1, 0.7, darknessValue)};
        this.filter.uniforms.tint.value = {x: brightness.x, y: brightness.y, z: brightness.z};
    }

    private onDayTimeMessage(message: Message) {
        let previousHour = this.hour;
        this.hour = message.content['hour'];
        if (previousHour === 21 && this.hour === 22) {
            // Show message about night
            (this.world.services.getService(NotifyService) as NotifyService).enqueue(45, "Night is coming..");
        }
    }
}