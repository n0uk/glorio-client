import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import MessageType = Protocol.MessageType;
import Message = Protocol.Message;

export default class PingService extends Service {
    private container: HTMLElement;

    private MAX_TIMEOUT: number = 1.0;
    private currentTimeout: number = 1.0;

    public constructor(world: Game) {
        super(world);

        this.container = document.getElementById('ping-container');

        this.toggle(true);
    }

    public update(dt: number) {
        this.currentTimeout -= dt;
        if (this.currentTimeout <= 0) {
            this.currentTimeout = this.MAX_TIMEOUT;
            this.world.socket.sendMessage(MessageType.Ping, {time: this.world.game.time.totalElapsedSeconds()});
        }
    }

    public getAveragePing(): number {
        return 0.2;
    }

    public onPingReply(message: Message)  {
        let diff: number = this.world.game.time.totalElapsedSeconds() - message.content['time'];
        diff = Math.round(diff * 1000);
        this.container.innerText = `${diff} ms`;
    }

    public toggle(flag: boolean) {
        this.container.style.display = flag ? 'block' : 'none';
    }

    public destroy() {
        this.toggle(false);
    }
}