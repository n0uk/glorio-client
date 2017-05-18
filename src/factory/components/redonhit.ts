import {Component} from "../entity";
import {Message} from "protobufjs";
import SpriteComponent from "./sprite";

export default class RedOnHitComponent extends Component {

    private cachedSpriteComponent: SpriteComponent;

    constructor() {
        super();
    }

    public start() {
        this.cachedSpriteComponent = this.entity.components.sprite as SpriteComponent;
        this.entity.on('receivedamage', this.onReceiveDamage.bind(this));
    }

    private onReceiveDamage(message: Message) {
        this.cachedSpriteComponent.flashRed();
    }
}