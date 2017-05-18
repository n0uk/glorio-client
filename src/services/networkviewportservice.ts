import Game from "../states/game";
import {Service} from "./servicemanager";
import {Protocol} from "../protocol/protocol";
import MessageType = Protocol.MessageType;

export default class NetworkViewportService extends Service {
    private currentWidth: number = 0;
    private currentHeight: number = 0;
    private updateTimeout: number = 0.3;
    private updateTimeoutMax: number = 0.3;

    constructor(world: Game) {
        super(world);
    }

    public update(dt: number) {
        this.updateTimeout -= dt;
        if (this.updateTimeout <= 0) {
            this.updateTimeout = this.updateTimeoutMax;
            this.performUpdate();
        }
    }

    private performUpdate() {
        if (this.world.camera.width !== this.currentWidth || this.world.camera.height !== this.currentHeight) {
            this.currentWidth = this.world.camera.width;
            this.currentHeight = this.world.camera.height;
            this.world.socket.sendMessage(MessageType.PlayerSetViewportSize, {width: this.currentWidth, height: this.currentHeight});
        }
    }
}