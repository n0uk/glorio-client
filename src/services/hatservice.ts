import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import MessageType = Protocol.MessageType;
import Message = Protocol.Message;
import HatComponent from "../factory/components/hat";
import {EventEmitter} from "events";
import HatType = Protocol.HatType;
import {Images} from "../assets";
import TeamManager from "./teammanager";

class HatListElement extends EventEmitter {
    public element: HTMLElement;
    private wearButton: HTMLElement;
    private hatType: number;

    public static getHatSprite(type: HatType) {
        if (type === HatType.WhiteBearHat) {
            return Images.ImagesWhitebearhaticon.getPNG();
        } else if (type === HatType.BrownBearHat) {
            return Images.ImagesBrownbearhaticon.getPNG();
        } else if (type === HatType.ChessHat) {
            return Images.ImagesChesshaticon.getPNG();
        } else if (type === HatType.CowboyHat) {
            return Images.ImagesCowboyhaticon.getPNG();
        } else if (type === HatType.ChickenHat) {
            return Images.ImagesChickenhaticon.getPNG();
        } else if (type === HatType.FoxHat) {
            return Images.ImagesFoxhaticon.getPNG();
        } else if (type === HatType.VikingHat) {
            return Images.ImagesVikinghaticon.getPNG();
        } else if (type === HatType.BuilderHat) {
            return Images.ImagesBuilderhaticon.getPNG();
        } else if (type === HatType.HockeyHat) {
            return Images.ImagesHockeyhaticon.getPNG();
        } else if (type === HatType.TankHat) {
            return Images.ImagesTankhaticon.getPNG();
        } else if (type === HatType.DruidHat) {
            return Images.ImagesDruidhaticon.getPNG();
        } else if (type === HatType.IceHat) {
            return Images.ImagesIcehaticon.getPNG();
        } else {
            return Images.ImagesKnight.getPNG();
        }
    }

    public constructor(hatType: number, active: boolean) {
        super();
        this.hatType = hatType;
        this.element = document.createElement('div');
        if (!active) {
            this.element.className = 'ui-hat-list-item is-aviable';
        } else {
            this.element.className = 'ui-hat-list-item is-active';
        }
        this.element.innerHTML = `
            <div class="ui-hat-image">
                <img src="${HatListElement.getHatSprite(hatType)}" />
            </div>
        `;
        if (!active) {
            this.element.onclick = function () {
                this.emit('wear');
            }.bind(this);
        }
    }
}

class HatList {
    private listContainer: HTMLDivElement;
    private elements: Array<HTMLElement>;
    private world: Game;

    public constructor(world: Game, listContainer: HTMLDivElement) {
        this.listContainer = listContainer;
        this.world = world;
    }

    private cleanup() {
        this.elements = [];
        this.listContainer.innerHTML = "";
    }

    public updateHats(hatTypes: Array<number>, currentHat: number) {
        this.cleanup();
        for (let i = 0; i < hatTypes.length; i++) {
            let hatType = hatTypes[i];
            let element = new HatListElement(hatType, hatType === currentHat);
            element.on('wear', function () {
                this.world.socket.sendMessage(MessageType.PlayerSelectHat, {hatType: hatType});
                (this.world.services.getService(HatManager) as HatManager).toggle();
            }.bind(this));
            this.listContainer.appendChild(element.element);
        }

        let hatType = -1;
        let element = new HatListElement(hatType, hatType === currentHat);
        element.on('wear', function () {
            this.world.socket.sendMessage(MessageType.PlayerSelectHat, {hatType: hatType});
            (this.world.services.getService(HatManager) as HatManager).toggle();
        }.bind(this));
        this.listContainer.appendChild(element.element);
    }
}

export default class HatManager extends Service {
    private container: HTMLElement;
    private isEnabled = false;
    private hatList: HatList;

    public constructor(world: Game) {
        super(world);
        this.world.socket.onMessage(MessageType.SyncHats, this.onSyncHats.bind(this));
        this.container = document.getElementById("ui-hat-list-container");
        document.getElementById('ui-hat-list-close').onclick = function () {
            this.toggle();
        }.bind(this);
        document.getElementById('ui-hat-close-button').onclick = function () {
            this.toggle();
        }.bind(this);

        this.hatList = new HatList(world, document.getElementById('ui-hat-list-content') as HTMLDivElement);
    }

    private onSyncHats(message: Message) {
        let hatTypes = message.content['hatTypes'];
        let currentHatType = message.content['currentHat'];
        this.hatList.updateHats(hatTypes, currentHatType);
    }

    public hide() {
        if (this.isEnabled) {
            this.toggle();
        }
    }

    public toggle() {
        this.isEnabled = !this.isEnabled;
        if (this.isEnabled) {
            (this.world.services.getService(TeamManager) as TeamManager).hide();
        }
        this.container.style.display = this.isEnabled ? 'block' : 'none';
    }

    public destroy() {
        if (this.isEnabled) {
            this.toggle();
        }
    }
}