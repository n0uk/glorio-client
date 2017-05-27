import {Component} from '../entity';
import Socket from "../../socket/socket";
import {Protocol} from "../../protocol/protocol";
import MessageType = Protocol.MessageType;
import TransformComponent from "./transform";
import BuildingType = Protocol.BuildingType;
import BuildingService from "../../services/buildingservice";

export default class NetworkInputComponent extends Component {
    public id: string = 'networkinput';
    private cursors: any;
    private wasd: any;
    private currentInput: Phaser.Point = new Phaser.Point();
    private currentRotation: number = 0;

    private previousInput: Phaser.Point = new Phaser.Point();
    private previousRotation: number = 0;

    private punchDirection: Phaser.Point = new Phaser.Point();
    private needSendPunch: boolean = false;

    private cachedTransform: TransformComponent;

    private _lockPunchUntilMouseUp = false;

    constructor() {
        super();
    }

    public lockPunchUntilMouseUp() {
        this._lockPunchUntilMouseUp = true;
    }

    private onNetworkSend() {
        if (!this.previousInput.equals(this.currentInput)
            || this.previousRotation !== this.currentRotation) {
                this.world.socket.sendMessage(MessageType.PlayerInput, {
                    x: this.currentInput.x,
                    y: this.currentInput.y,
                    rotation: this.currentRotation
                });
                this.previousInput.copyFrom(this.currentInput);
                this.previousRotation = this.currentRotation;
        }
        if (this.needSendPunch) {
            this.punchDirection.normalize();
            this.world.socket.sendMessage(MessageType.PlayerAction,
                {x: this.punchDirection.x, y: this.punchDirection.y, action: 0});
            this.needSendPunch = false;
        }
    }

    public start() {
        this.cachedTransform = this.entity.components.transform as TransformComponent;

        this.entity.on('networksend', this.onNetworkSend.bind(this));
        this.cursors = this.world.game.input.keyboard.createCursorKeys();
        this.wasd = {
            up: this.world.game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: this.world.game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: this.world.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.world.game.input.keyboard.addKey(Phaser.Keyboard.D),
        };

        this.world.game.input.onDown.add(this.onMouseDown, this);
    }

    private onMouseDown() {
        if (!(this.world.services.getService(BuildingService) as BuildingService).inProgress()) {
            this.punchDirection.set(this.world.game.input.activePointer.worldX - this.cachedTransform.position.x,
                this.world.game.input.activePointer.worldY - this.cachedTransform.position.y);
            this.needSendPunch = true;
            this.entity.emit('sendpunch');
        }
    }

    public update(dt: number) {
        let ix: number = 0;
        let iy: number = 0;
        if (this.cursors.up.isDown || this.wasd.up.isDown) {
            iy = -1;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            iy = 1;
        }

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            ix = -1;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            ix = 1;
        }

        this.currentInput.set(ix, iy);

        let rotation: number = Phaser.Math.angleBetween(
            0,
            0,
            this.world.game.input.activePointer.worldX - this.cachedTransform.position.x,
            this.world.game.input.activePointer.worldY - this.cachedTransform.position.y);

        rotation += Phaser.Math.degToRad(90);
        rotation = parseFloat(rotation.toPrecision(2));

        this.currentRotation = rotation;

        if (this.world.game.input.activePointer.isDown) {
            if (!this._lockPunchUntilMouseUp) {
                this.onMouseDown();
            }
        } else if (this._lockPunchUntilMouseUp) {
            this._lockPunchUntilMouseUp = false;
        }

    }

    public destroy() {
        this.world.game.input.onDown.remove(this.onMouseDown, this);
    }
}