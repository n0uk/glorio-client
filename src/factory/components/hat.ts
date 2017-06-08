import {Component} from "../entity";
import {Message} from "protobufjs";
import TransformComponent from "./transform";
import {Protocol} from "../../protocol/protocol";
import HatType = Protocol.HatType;
import {Images} from "../../assets";

export default class HatComponent extends Component {
    public id = "hat";

    private hatId: number = -1;
    private cachedTransform: TransformComponent;
    private hatSprite: Phaser.Sprite;
    private layer: Phaser.Group;
    private currentTintColor: number = 0xffffff;
    private currentScale: number = 1.0;

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
            this.setScale(this.currentScale);
            this.setColor(this.currentTintColor);
        }
    }

    private getHatSprite(type: HatType) {
        if (type === HatType.WhiteBearHat) {
            return Images.ImagesWhitebearhat.getName();
        } else if (type === HatType.BrownBearHat) {
            return Images.ImagesBrownbearhat.getName();
        } else if (type === HatType.ChessHat) {
            return Images.ImagesChesshat.getName();
        } else if (type === HatType.CowboyHat) {
            return Images.ImagesCowboyhat.getName();
        }

        // Default
        return Images.ImagesWhitebearhat.getName();
    }

    public setScale(scale: number) {
        this.currentScale = scale;
        if (this.hatSprite) {
            this.hatSprite.scale.set(scale, scale);
        }
    }

    public setColor(color: number) {
        this.currentTintColor = color;
        if (this.hatSprite) {
            this.hatSprite.tint = color;
        }
    }

    public destroy() {
        if (this.hatSprite) {
            this.hatSprite.destroy();
            this.hatSprite = null;
        }
    }
}