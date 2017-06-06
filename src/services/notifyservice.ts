import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import MessageType = Protocol.MessageType;
import Message = Protocol.Message;

class NotifyMessage {
    public timeout: number;
    public text: string;

    public constructor(timeout: number, text: string) {
        this.timeout = timeout;
        this.text = text;
    }
}

export default class NotifyService extends Service {
    private queue: Array<NotifyMessage> = [];
    private label: Phaser.Text;
    private currentMessage: NotifyMessage;

    public constructor(world: Game) {
        super(world);

        this.label = this.world.game.make.text(0, 0, "", {
            fontSize: '18px',
            font: 'Roboto Mono'
        });
        this.label.anchor.set(0, 1);
        // Stroke color and thickness
        this.label.stroke = 'rgba(0,0,0,0.7)';
        this.label.strokeThickness = 3;
        this.label.fill = "#fff";

        this.label.fixedToCamera = true;
    }

    public enqueue(timeout: number, text: string) {
        this.queue.push(new NotifyMessage(timeout, text));
    }

    public update(dt: number) {
        if (this.currentMessage) {
            this.label.cameraOffset.setTo(20, this.world.game.height - 180);
            if (this.currentMessage.timeout > 1 && this.label.alpha < 1) {
                this.label.alpha += dt;
            } else if (this.currentMessage.timeout < 1) {
                this.label.alpha = this.currentMessage.timeout;
            }
            this.currentMessage.timeout -= dt;
            if (this.currentMessage.timeout < 0) {
                this.currentMessage = null;
                this.label.parent.removeChild(this.label);
            }
        } else if (this.queue.length > 0) {
            this.currentMessage = this.queue.shift();
            this.label.setText(this.currentMessage.text);
            this.label.alpha = 0;
            this.world.LAYER_UI.add(this.label);
        }
    }

    public destroy() {
        this.label.destroy();
    }
}