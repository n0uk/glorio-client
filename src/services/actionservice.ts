import {CraftMenuService, MenuContainer, MenuItem} from "./craftmenuservice";
import Game from "../states/game";
import {Service} from "./servicemanager";
import {Protocol} from "../protocol/protocol";
import MessageType = Protocol.MessageType;
import * as Assets from '../assets';
import TeamManager from "./teammanager";

class ActionContainer extends MenuContainer {
    constructor() {
        super();
        this.element = document.getElementById("top-panel") as HTMLDivElement;
    }
}


class ActionMenuItem extends MenuItem {
    private world: Game;

    constructor(world: Game, img: string, name: any, hotKey: string, hotKeyDisplay: string) {
        super(name, hotKey);

        this.world = world;

        this.element.className = 'item';
        this.element.innerHTML = `
            <img src="${img}" />
            <div class="hotkey" id="${name}:hotkey">${hotKeyDisplay}</div>
        `;

    }


    protected onClick() {
        // Show sub-menu
        super.onClick();
    }

    public action() {
        (this.world.services.getService(ActionService) as ActionService).requestWork(this.name);
    }
}

export class ActionService extends Service {
    private actionMenu: ActionContainer;

    constructor(world: Game) {
        super(world);
        this.actionMenu = new ActionContainer();
        this.actionMenu.appendChild(new ActionMenuItem(this.world, Assets.Images.ImagesBuild.getPNG(), 'shop-show', 'B', 'B'));
        this.actionMenu.appendChild(new ActionMenuItem(this.world, Assets.Images.ImagesUnmount.getPNG(), 'unmount', 'U', 'U'));
        this.actionMenu.appendChild(new ActionMenuItem(this.world, Assets.Images.ImagesUnmount.getPNG(), 'team', 'T', 'T'));
    }

    public requestWork(id: string) {
        if (id === 'shop-show') {
            (this.world.services.getService(CraftMenuService) as CraftMenuService).shopMenu.toggle();
        } else if (id === 'unmount') {
            this.world.socket.sendMessage(MessageType.PlayerUnmountRequest, {});
        } else if (id === 'team') {
            (this.world.services.getService(TeamManager) as TeamManager).toggle();
        }
    }
}