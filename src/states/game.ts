import Socket from '../socket/socket';
import {Protocol} from '../protocol/protocol';
import MessageType = Protocol.MessageType;
import Message = Protocol.Message;
import {Entity} from '../factory/entity';
import {EntityFactory} from '../factory/entityfactory';
import {ServiceManager} from "../services/servicemanager";
import NetworkSendService from "../services/networksendservice";
import SpriteComponent from "../factory/components/sprite";
import TransformComponent from "../factory/components/transform";
import MapService from "../services/mapservice";
import ResourceService from "../services/resources";
import Player from "../factory/player";
import PingService from "../services/pingservice";
import FloatResourcesService from "../services/floatresources";
import ChildService from "../services/childservice";
import BuildingService from "../services/buildingservice";
import LeaderboardService from "../services/leaderboards";
import MinimapService from "../services/minimap";
import LevelService from "../services/levelservice";
import CookieReader from "../utils/cookiereader";
import {UrlParse} from "../utils/urlparse";
import getUrlParameterByName = UrlParse.getUrlParameterByName;
import AdController from "../classes/adcontroller";
import NetworkTransformComponent from "../factory/components/networktransform";
import RespawnWindow from "../classes/respawn-window";
import Spectator from "../factory/spectator";
import NetworkViewportService from "../services/networkviewportservice";
import {CraftMenuService} from "../services/craftmenuservice";
import {ActionService} from "../services/actionservice";
import ServerManager from "../servermanager";

enum eGameState {
    LOBBY,
    GAME,
    RESPAWN
}

export default class Game extends Phaser.State {
    public LAYER_BACKGROUND_0: Phaser.Group;
    public LAYER_BACKGROUND_1: Phaser.Group;
    public LAYER_MIDDLE_0: Phaser.Group;
    public LAYER_MIDDLE_1: Phaser.Group;
    public LAYER_FOREGROUND_0: Phaser.Group;
    public LAYER_UI: Phaser.Group;

    public socket: Socket;
    public networkId: number;
    public teamId: string;
    public assignedObject: Entity;

    public services: ServiceManager = new ServiceManager();

    private entityHash: IntMap<Entity> = {};

    public gameState: eGameState = eGameState.LOBBY;

    public respawnWindow: RespawnWindow;

    public init(socket): void {
        this.socket = socket;
        this.socket.onMessage(MessageType.Assign, this.onAssignMessage.bind(this));
        this.socket.onMessage(MessageType.SyncObject, this.onSyncMessage.bind(this));
        this.socket.onMessage(MessageType.SyncObjectDelete, this.onSyncMessageDelete.bind(this));
        this.socket.onMessage(MessageType.ObjectSendDamage, this.onSendDamage.bind(this));
        this.socket.onMessage(MessageType.ObjectReceiveDamage, this.onReceiveDamage.bind(this));
        this.socket.onMessage(MessageType.SyncBackpack, this.onSyncBackpack.bind(this));
        this.socket.onMessage(MessageType.Ping, this.onPingReply.bind(this));
        this.socket.onMessage(MessageType.FloatResources, this.onFloatResources.bind(this));
        this.socket.onMessage(MessageType.SyncChild, this.onSyncChild.bind(this));
        this.socket.onMessage(MessageType.SyncChildDelete, this.onSyncChildDelete.bind(this));
        this.socket.onMessage(MessageType.LeaderboardMessage, this.onLeaderboardMessage.bind(this));
        this.socket.onMessage(MessageType.MapMessage, this.onMapMessage.bind(this));
        this.socket.onMessage(MessageType.ChatMessage, this.onChatMessage.bind(this));
        this.socket.onMessage(MessageType.PlayerBuildResponse, this.onBuildResponse.bind(this));

        this.respawnWindow = new RespawnWindow(this);
        this.initializeLoginButton();
        this.initializeGameState(eGameState.LOBBY);
    }

    private initializeLoginButton() {
        let loginInput: HTMLInputElement = (<HTMLInputElement>document.getElementById('login-input'));
        loginInput.focus();
        if (CookieReader.read('nickname')) {
            loginInput.value = CookieReader.read('nickname');
        }
        (<HTMLInputElement>document.getElementById('login-button')).onclick = this.onLoginButtonClick.bind(this);
    }

    private onLoginButtonClick() {
        let loginInput: HTMLInputElement = (<HTMLInputElement>document.getElementById('login-input'));
        let name: string = loginInput.value;
        CookieReader.write('nickname', name);
        AdController.play(function () {
            this.request_spawn(name);
        }.bind(this));
    }

    private initializeGameState(state: eGameState) {
        if (state === eGameState.LOBBY) {
            document.getElementById("lobby-layout").style.display = 'block';
            document.getElementById("game-layout").style.display = 'none';
            document.getElementById("respawn-layout").style.display = 'none';
            this.game.input.keyboard.enabled = false;
        } else if (state === eGameState.GAME) {
            document.getElementById("lobby-layout").style.display = 'none';
            document.getElementById("game-layout").style.display = 'block';
            document.getElementById("respawn-layout").style.display = 'none';
            this.game.input.keyboard.enabled = true;
        } else if (state === eGameState.RESPAWN) {
            document.getElementById("lobby-layout").style.display = 'none';
            document.getElementById("game-layout").style.display = 'none';
            document.getElementById("respawn-layout").style.display = 'block';
            this.game.input.keyboard.enabled = false;
            this.respawnWindow.show();
        }

        this.gameState = state;
    }

    private onBuildResponse(message: Message) {
        (this.services.getService(BuildingService) as BuildingService).onBuildResponse(message.content);
    }

    private onChatMessage(message: Message) {
        let id: number = message.content['id'];
        if (this.entityHash.hasOwnProperty(id.toString())) {
            this.entityHash[id].emit('chatmessage', message.content['message']);
        }
    }

    private onMapMessage(message: Message) {
        (this.services.getService(MinimapService) as MinimapService).onMapMessage(message);
    }

    private onLeaderboardMessage(message: Message) {
        (this.services.getService(LeaderboardService) as LeaderboardService).onScoreMessage(message);
    }

    private onSyncChild(message: Message) {
        (this.services.getService(ChildService) as ChildService).onCreateChild(message);
    }

    private onSyncChildDelete(message: Message) {
        (this.services.getService(ChildService) as ChildService).onRemoveChild(message);
    }

    private onFloatResources(message: Message) {
        // console.log("Float resources!");
        let id: number = message.content['id'];
        if (this.entityHash.hasOwnProperty(id.toString())) {
            let position: Phaser.Point = (this.entityHash[id].components.transform as TransformComponent).position;
            (this.services.getService(FloatResourcesService) as FloatResourcesService).float(position.x, position.y, message.content['counts']);
        }

    }

    private onPingReply(message: Message) {
        (this.services.getService(PingService) as PingService).onPingReply(message);
    }

    private onSyncBackpack(message: Message) {
        // message.content.counts - array of resources
        (this.services.getService(ResourceService) as ResourceService).sync(message.content['counts']);
    }

    private onReceiveDamage(message: Message) {
        let id: number = message.content['id'];
        if (this.entityHash.hasOwnProperty(id.toString())) {
            this.entityHash[id].emit('receivedamage');
        }
    }

    private onSendDamage(message: Message) {
        let id: number = message.content['id'];
        if (this.entityHash.hasOwnProperty(id.toString())) {
            this.entityHash[id].emit('senddamage');
        }
    }

    private onSyncMessageDelete(message: Message) {
        let id: number = message.content['id'];
        this.entityHash[id].destroy();
        delete this.entityHash[id];
    }

    private initializePartyLink() {
        let partylink = document.getElementById('partylink');
        partylink.style.visibility = 'visible';
        partylink.onclick = function () {
            history.pushState({id: 0}, '', `/?ip=${ServerManager.getHostAddressRaw()}&teamId=${this.teamId}`);
        }.bind(this);
    }

    private onSyncMessage(message: Message) {
        let id: number = message.content['id'];
        let isNew: boolean = false;
        if (!this.entityHash[id]) {
            this.entityHash[id] = EntityFactory.create(message.content['objectType'], this, id, message.content['parentId']);
            isNew = true;
        }

        if (id === this.networkId && isNew && message.content['teamId']) {
            this.teamId = message.content['teamId'];
            this.initializePartyLink();
        }

        this.entityHash[id].emit('networksync', message.content);
        if (id === this.networkId && isNew) {
            this.assignedObject = this.entityHash[id];

            if (this.assignedObject instanceof Player) {
                // Game started
                this.onGameStart();
            } else if (this.assignedObject instanceof Spectator) {
                if (this.gameState === eGameState.GAME) {
                    this.initializeGameState(eGameState.RESPAWN);
                }
            }
            if (this.assignedObject.components.sprite) {
                this.camera.follow((this.assignedObject.components.sprite as SpriteComponent).sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
            } else {
                if (message.content['x'] && message.content['y']) {
                    this.camera.focusOnXY(message.content['x'],
                        message.content['y']);
                }
            }
        }
    }

    private onAssignMessage(message: Message): void {
        this.networkId = message.content['id'];
        // console.log(`Assign id: ${this.networkId}`);
        this.camera.unfollow();
        this.cleanup();
    }

    public onGameStart(): void {
        this.initializeGameState(eGameState.GAME);
    }

    public preload(): void {

    }

    public cleanup(): void {
        for (let id in this.entityHash) {
            this.entityHash[id].destroy();
        }
        this.entityHash = {};
        this.assignedObject = null;
        this.services.cleanup();
    }

    public getTeamId() {
        return getUrlParameterByName('teamId') || '';
    }

    public request_respawn() {
        let loginInput: HTMLInputElement = (<HTMLInputElement>document.getElementById('login-input'));
        let name: string = loginInput.value;
        this.request_spawn(name);
    }

    public request_spawn(name: string) {
        this.socket.sendMessage(MessageType.PlayerSpawnRequest, {name: name, teamId: this.getTeamId()});
    }

    public createLayers() {
        this.LAYER_BACKGROUND_0 = this.game.add.group();
        this.LAYER_BACKGROUND_1 = this.game.add.group();
        this.LAYER_MIDDLE_0 = this.game.add.group();
        this.LAYER_MIDDLE_1 = this.game.add.group();
        this.LAYER_FOREGROUND_0 = this.game.add.group();
        this.LAYER_UI = this.game.add.group();
    }

    public create(): void {
        this.createLayers();
        this.services.registerService(new NetworkSendService(this));
        this.services.registerService(new NetworkViewportService(this));
        this.services.registerService(new MapService(this));
        this.services.registerService(new ResourceService(this));
        this.services.registerService(new PingService(this));
        this.services.registerService(new FloatResourcesService(this));
        this.services.registerService(new BuildingService(this));
        this.services.registerService(new ChildService(this));
        this.services.registerService(new LeaderboardService(this));
        this.services.registerService(new MinimapService(this));
        this.services.registerService(new LevelService(this));
        this.services.registerService(new CraftMenuService(this));
        this.services.registerService(new ActionService(this));
    }

    public update(): void {
        let dt: number = this.game.time.elapsed / 1000.0;

        for (let id in this.entityHash) {
            this.entityHash[id].update(dt);
        }

        this.services.update(dt);
    }

    public shutdown() {
        this.cleanup();
        this.services.destroy();
    }
}
