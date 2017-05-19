import {Component} from "../entity";
import TransformComponent from "./transform";
import SpriteComponent from "./sprite";
import {Protocol} from "../../protocol/protocol";
import Message = Protocol.Message;


class ChatBubble {

    private container: HTMLElement;

    constructor(text: string) {
        this.container = document.createElement('div');
        this.container.innerText = text;
        this.container.style.left = '0px';
        this.container.style.top = '0px';
        this.container.className = 'speechbubble';
        document.body.appendChild(this.container);
    }

    public setPosition(x: number, y: number) {
        x = Math.round(x);
        y = Math.round(y);
        let width: number = this.container.offsetWidth;
        let height: number = this.container.offsetHeight;
        x = x - width / 2;
        y = y - height;
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
    }

    public setText(message) {
        this.container.innerText = message;
    }

    public destroy() {
        this.container.parentElement.removeChild(this.container);
    }
}

export default class ChatBubbleComponent extends Component {
    protected chatBubble: ChatBubble = null;
    protected chatBubbleTimer: Phaser.TimerEvent = null;
    protected cachedTransform: TransformComponent;
    protected cachedSprite: SpriteComponent;
    protected offset: number;

    constructor(offset: number) {
        super();
        this.offset = offset;
    }

    public start() {
        super.start();
        this.cachedTransform = this.entity.components.transform as TransformComponent;
        this.cachedSprite = this.entity.components.sprite as SpriteComponent;
        this.entity.on('chatmessage', this.onChatMessage.bind(this));
    }

    protected onChatMessage(message: string) {
        if (!this.chatBubble) {
            this.chatBubble = new ChatBubble(message);
        } else {
            this.world.game.time.events.remove(this.chatBubbleTimer);
            this.chatBubble.setText(message);
        }

        this.align();

        this.chatBubbleTimer = this.world.game.time.events.add(Phaser.Timer.SECOND * 7, function () {
            if (this.chatBubble) {
                this.chatBubble.destroy();
                this.chatBubble = null;
            }
        }, this);
    }

    protected align() {
        if (this.chatBubble) {
            let y = this.cachedTransform.position.y + this.offset;
            if (this.cachedSprite) {
                y -= this.cachedSprite.sprite.height / 2;
            }
            this.chatBubble.setPosition(this.cachedTransform.position.x - this.world.game.camera.x, y - this.world.game.camera.y);
        }
    }

    public update(dt: number) {
        super.update(dt);
        this.align();
    }

    public destroy() {
        if (this.chatBubble) {
            this.chatBubble.destroy();
            this.chatBubble = null;
        }
    }
}