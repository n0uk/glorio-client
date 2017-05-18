import Game from "../states/game";
import {Service} from "./servicemanager";

export default class NetworkSendService extends Service {
    private updateTimeoutMax: number = 0.05;
    private updateTimeout: number = 0;

    constructor(world: Game) {
        super(world);
    }

    public update(dt: number) {
        this.updateTimeout -= dt;
        if (this.updateTimeout <= 0) {
            this.updateTimeout = this.updateTimeoutMax;
            this.sendUpdate();
        }
    }

    private sendUpdate() {
        if (this.world.assignedObject) {
            this.world.assignedObject.emit('networksend');
        }
    }
}