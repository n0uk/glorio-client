import {Component} from "../entity";
import TransformComponent from "./transform";
import SpriteComponent from "./sprite";
import {Protocol} from "../../protocol/protocol";
import Message = Protocol.Message;
import MessageType = Protocol.MessageType;

class ChatInput {

    private container: HTMLElement;
    private input: HTMLInputElement;
    private callback;
    private cancelcallback;

    constructor(callback, cancelcallback) {
        this.callback = callback;
        this.cancelcallback = cancelcallback;

        this.container = document.createElement('div');
        this.container.style.left = '0px';
        this.container.style.top = '0px';
        this.container.className = 'speechbubble';

        this.input = <HTMLInputElement>document.createElement('input');
        this.input.type = 'text';
        this.input.maxLength = 60;
        this.container.appendChild(this.input);
        let self = this;
        this.input.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) {
                self.send();
                e.stopImmediatePropagation();
            }
        });
        this.input.addEventListener('keydown', function(e) {
            if (e.keyCode === 27) {
                self.cancel();
            }
        });
        document.body.appendChild(this.container);
        this.input.focus();
    }

    public cancel() {
        this.cancelcallback();
    }

    public send() {
        this.callback(this.input.value);
    }

    public setposition(x: number, y: number) {
        x = Math.round(x);
        y = Math.round(y);
        let width: number = this.container.offsetWidth;
        let height: number = this.container.offsetHeight;
        x = x - width / 2;
        y = y - height;
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
    }

    public destroy() {
        this.container.parentElement.removeChild(this.container);
    }
}

export default class ChatInputComponent extends Component {
    public id: string = "chatinput";

    protected chatInput: ChatInput = null;
    protected cachedTransform: TransformComponent;
    protected cachedSprite: SpriteComponent;
    protected offset: number;
    protected returnKey: any;
    protected escapeKey: any;

    constructor(offset: number) {
        super();
        this.offset = offset;
    }

    public start() {
        super.start();
        this.cachedTransform = this.entity.components.transform as TransformComponent;
        this.cachedSprite = this.entity.components.sprite as SpriteComponent;
        this.returnKey = this.world.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        this.returnKey.onDown.add(this.onReturnKey, this);
        this.escapeKey = this.world.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    }

    public onReturnKey() {
        if (!this.chatInput) {
            this.chatInput = new ChatInput(this.onChatRequest.bind(this), this.onChatCancel.bind(this));
            this.align();
            this.world.game.input.keyboard.enabled = false;
        }
    }

    public onChatRequest(message: string) {
        if (this.chatInput) {
            this.world.socket.sendMessage(MessageType.PlayerChatRequest, {
                message: message
            });
            this.stopInput();
        }
    }

    protected onChatCancel() {
        this.stopInput();
    }

    protected stopInput() {
        if (this.chatInput) {
            this.chatInput.destroy();
            this.world.game.input.keyboard.reset(false);
            this.world.game.input.keyboard.enabled = true;
            this.chatInput = null;
        }

    }

    protected align() {
        if (this.chatInput) {
            let y = this.cachedTransform.position.y + this.offset;
            if (this.cachedSprite) {
                y -= this.cachedSprite.sprite.height / 2;
            }
            this.chatInput.setposition(this.cachedTransform.position.x - this.world.game.camera.x, y - this.world.game.camera.y);
        }
    }

    public update(dt: number) {
        super.update(dt);
        this.align();
        if (this.escapeKey.isDown) {
            this.stopInput();
        }
    }

    public destroy() {
        this.stopInput();
        this.returnKey.onDown.remove(this.onReturnKey, this);
    }
}