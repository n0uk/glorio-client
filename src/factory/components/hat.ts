import {Component} from "../entity";
import {Message} from "protobufjs";
import TransformComponent from "./transform";
import {Protocol} from "../../protocol/protocol";
import HatType = Protocol.HatType;
import {Images} from "../../assets";

export default class HatComponent extends Component {
    private hatId: number = -1;
    private cachedTransform: TransformComponent;
    private hatSprite: Phaser.Sprite;
    private layer: Phaser.Group;

    constructor(layer: Phaser.Group) {
        super();
        this.layer = layer;
    }

    public start() {
        this.cachedTransform = this.entity.components.transform as TransformComponent;
        this.entity.on('networksync', this.onNetworkSync.bind(this));
    }

    public update(dt: number) {
        if (this.hatSprite) {
            this.hatSprite.position.copyFrom(this.cachedTransform.position);
            this.hatSprite.rotation = this.cachedTransform.rotation;
        }
    }

    private onNetworkSync(message: Message) {
        if (message.hasOwnProperty('hatId')) {
            if (this.hatId !== message['hatId']) {
                this.setHat(message['hatId']);
            }
        }
    }

    private setHat(hatId: number) {
        if (this.hatSprite) {
            this.hatSprite.destroy();
            this.hatSprite = null;
        }
        if (hatId > -1) {
            this.hatSprite = this.layer.create(this.cachedTransform.position.x, this.cachedTransform.position.y, this.getHatSprite(hatId));
            this.hatSprite.anchor.set(0.5, 0.5);
        }
    }

    private getHatSprite(type: HatType) {
        if (type === HatType.WhiteBearHat) {
            return Images.ImagesWhitebearhat.getName();
        }

        // Default
        return Images.ImagesWhitebearhat.getName();
    }

    public destroy() {
        if (this.hatSprite) {
            this.hatSprite.destroy();
            this.hatSprite = null;
        }
    }
}