import AnimatorComponent from "./animator";
import {Message} from "protobufjs";

export default class DoorAnimatorComponent extends AnimatorComponent {

    private isOpened: boolean = false;

    constructor() {
        super();
    }

    public start() {
        super.start();
        this.entity.on('networksync', this.onNetworkSync.bind(this));
    }

    private set (frame) {
        this.cachedSpriteComponent.sprite.frameName = frame;
    }

    private onNetworkSync(message: Message) {
        let updated = false;
        if (message.hasOwnProperty('isOpened')) {
            this.isOpened = message['isOpened'];
            updated = true;
        }

        if (updated) {
            if (this.isOpened) {
                this.set('door_open.png');
            } else {
                this.set('door_close.png');
            }
        }
    }
}