import {Service} from "./servicemanager";
import Game from "../states/game";
import * as Assets from '../assets';
import BuildingService from "./buildingservice";
import {Protocol} from "../protocol/protocol";
import BuildingType = Protocol.BuildingType;
import ResourceService from "./resources";
import ChildService from "./childservice";
import BuildingTypeToEntityType = Protocol.BuildingTypeToEntityType;

export interface IHTMLChild {
    element: HTMLDivElement;
}

export class MenuItem implements IHTMLChild {
    public element: HTMLDivElement;
    public name: any;

    protected key: Phaser.Key;

    constructor(name: any, hotKey: string) {
        this.name = name;
        this.element = document.createElement("div");
        this.element.className = "item";
        this.element.onclick = this.onClick.bind(this);
        this.element.id = name;
        if (hotKey) {
            this.key = Phaser.GAMES[0].input.keyboard.addKey(Phaser.Keyboard[hotKey]);
            this.key.onDown.add(this.onClick, this);
        }
    }

    public action() {

    }

    protected onClick() {
        this.action();
    }

    public destroy() {
        if (this.key) {
            this.key.onDown.remove(this.onClick, this);
            this.key = null;
        }
        this.element = null;
    }

    public updateAvailability (flag: boolean) {
        if (this.element) {
            this.element.classList.remove('available');
            this.element.classList.remove('unavailable');
            this.element.classList.add(flag ? 'available' : 'unavailable');
        }
    }
}

export class MenuContainer implements IHTMLChild {
    public element: HTMLDivElement;
    public items: Array<MenuItem> = [];

    constructor() {

    }

    public appendChild(item: MenuItem) {
        this.element.appendChild(item.element);
        this.items.push(item);
    }

    public destroy() {
        for (let item of this.items) {
            item.destroy();
        }
        this.items = [];
    }
}

class BottomMenu extends MenuContainer {
    constructor(id: string) {
        super();
        this.element = document.getElementById("bottom-panel") as HTMLDivElement;
    }

    public appendMany(world: Game, definitions: Array<any>): Array<BottomMenuItem> {
        let menuItems: Array<BottomMenuItem> = [];
        for (let item of definitions) {
            let menuItem = new BottomMenuItem(world, item.img, item.name, item.hotKey, item.hotKeyDisplay, item.tooltip, item.maxLimit);
            this.appendChild(menuItem);
            menuItems.push(menuItem);
        }
        return menuItems;
    }
}


class LeftMenu extends MenuContainer {
    constructor(id: string) {
        super();
        this.element = document.getElementById("left-panel") as HTMLDivElement;
    }

    public appendMany(world: Game, definitions: Array<any>): Array<LeftMenuItem> {
        let menuItems: Array<LeftMenuItem> = [];
        for (let item of definitions) {
            let menuItem = new LeftMenuItem(world, item.img, item.name, item.hotKey, item.hotKeyDisplay, item.tooltip, item.maxLimit);
            this.appendChild(menuItem);
            menuItems.push(menuItem);
        }
        return menuItems;
    }

    public pushRecently(item: ShopMenuItem) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].name === item.name) {
                return;
            }
        }

        for (let i = 0; i < this.items.length; i++) {
            let it;
            if (i === this.items.length - 1) {
                it = item;
            } else {
                it = this.items[i + 1];
            }

            // set it on current idx
            (this.items[i] as LeftMenuItem).reInit(
                (it as any).getImage(),
                it.name,
                (this.items[i] as LeftMenuItem).getHotKey(),
                ((Phaser.GAMES[0].state.getCurrentState() as Game).services.getService(CraftMenuService) as CraftMenuService).getTooltipFor(it.name),
                ((Phaser.GAMES[0].state.getCurrentState() as Game).services.getService(CraftMenuService) as CraftMenuService).getMaxLimit(it.name)
            );
        }
    }
}

class LeftMenuItem extends MenuItem {
    private world: Game;
    public limit: HTMLElement;
    private maxLimit: number;
    private img: string;
    private hotKey: string;

    public getImage(): string {
        return this.img;
    }

    public getHotKey(): string {
        return this.hotKey;
    }

    constructor(world: Game, img: string, name: any, hotKey: string, hotKeyDisplay: string, tooltip: string, maxLimit: number) {
        super(name, hotKey);

        this.img = img;
        this.hotKey = hotKey;
        this.world = world;
        this.maxLimit = maxLimit;

        this.element.className = 'tooltip item';
        this.element.innerHTML = `
            <div class="tooltiptextright">
                ${tooltip}
            </div>
            <img src="${img}" />
            <div class="hotkey" id="${name}:hotkey">${hotKeyDisplay}</div>
        `;
        this.limit = document.createElement('div');
        this.limit.className = 'limit';
        this.limit.innerHTML = `0/${maxLimit}`;
        this.element.appendChild(this.limit);
    }

    public reInit(img: string, name: any, hotKeyDisplay: string, tooltip: string, maxLimit: number) {
        // Recreate element
        this.name = name;
        this.img = img;
        this.maxLimit = maxLimit;
        this.element.className = 'tooltip item';
        this.element.innerHTML = `
            <div class="tooltiptextright">
                ${tooltip}
            </div>
            <img src="${img}" />
            <div class="hotkey" id="${name}:hotkey">${hotKeyDisplay}</div>
        `;
        this.limit = document.createElement('div');
        this.limit.className = 'limit';
        this.limit.innerHTML = `0/${maxLimit}`;
        this.element.appendChild(this.limit);
    }

    public updateLimit(current: number) {
        this.limit.innerText = `${current}/${this.maxLimit}`;
    }

    protected onClick() {
        // Show sub-menu
        super.onClick();
    }

    public action() {
        (this.world.services.getService(BuildingService) as BuildingService).requestWork(this.name);
    }
}


class BottomMenuItem extends MenuItem {
    private world: Game;
    public limit: HTMLElement;

    private maxLimit: number;

    constructor(world: Game, img: string, name: any, hotKey: string, hotKeyDisplay: string, tooltip: string, maxLimit: number) {
        super(name, hotKey);

        this.world = world;
        this.maxLimit = maxLimit;

        this.element.className = 'tooltip item';
        this.element.innerHTML = `
            <div class="tooltiptext">
                ${tooltip}
            </div>
            <img src="${img}" />
            <div class="hotkey" id="${name}:hotkey">${hotKeyDisplay}</div>
        `;
        this.limit = document.createElement('div');
        this.limit.className = 'limit';
        this.limit.innerHTML = `0/${maxLimit}`;
        this.element.appendChild(this.limit);
    }

    public updateLimit(current: number) {
        this.limit.innerText = `${current}/${this.maxLimit}`;
    }

    protected onClick() {
        // Show sub-menu
        super.onClick();
    }

    public action() {
        (this.world.services.getService(BuildingService) as BuildingService).requestWork(this.name);
    }
}

class ShopMenuItem extends MenuItem {
    private world: Game;
    public limit: HTMLElement;

    private img: string;
    private maxLimit: number;

    private getImage(): string {
        return this.img;
    }

    constructor(world: Game, img: string, name: any, hotKey: string, hotKeyDisplay: string, maxLimit: number, displayName: string, displayDescription: string, displayPrice: string) {
        super(name, hotKey);

        this.img = img;
        this.world = world;
        this.maxLimit = maxLimit;

        this.element.className = 'shop-item';
        this.element.innerHTML = `
            <div class="price">${displayPrice}</div>
            <div class="icon">
            <img width="48px" height="48px" src="${img}"/>
            </div>
            <div class="content">
            <div class="content-name">${displayName} <span id="n${name}_building_price">0/${maxLimit}</span></div>
            <div class="content-description">${displayDescription}</div>
            </div>
        `;
    }

    public updateLimit(current: number) {
        if (!this.limit) {
            this.limit = document.getElementById(`n${this.name}_building_price`);
        }
        this.limit.innerText = `${current}/${this.maxLimit}`;
    }

    protected onClick() {
        // Show sub-menu
        super.onClick();
    }

    public action() {
        (this.world.services.getService(BuildingService) as BuildingService).requestWork(this.name);
        (this.world.services.getService(CraftMenuService) as CraftMenuService).recentlyUsed(this);
    }
}

class ShopMenu extends MenuContainer {
    private parentElement: HTMLDivElement;
    private key: Phaser.Key;
    constructor(id: string) {
        super();
        this.parentElement = document.getElementById("shop") as HTMLDivElement;
        this.element = document.getElementById("shop-list") as HTMLDivElement;
        this.key = Phaser.GAMES[0].input.keyboard.addKey(Phaser.KeyCode.ESC);
        this.key.onDown.add(this.hide, this);
        document.addEventListener('click', function (e) {
            if (this.parentElement.style.display === 'block') {
                if (e.target !== this.element && e.target.id !== 'shop-show' && (!e.target.parentElement || e.target.parentElement.id !== 'shop-show')) {
                    this.hide();
                }
            }
        }.bind(this));
        this.hide();
    }

    public appendMany(service: CraftMenuService, definitions: Array<any>): Array<ShopMenuItem> {
        let menuItems: Array<ShopMenuItem> = [];
        for (let item of definitions) {
            // item.tooltip, item.maxLimit, item.displayName, item.displayDescription, item.displayPrice;
            let menuItem = new ShopMenuItem(service.world,
                item.img,
                item.name,
                item.hotKey,
                item.hotKeyDisplay,
                service.getMaxLimit(item.name),
                service.getDisplayNameFor(item.name),
                service.getDisplayDescription(item.name),
                service.getDisplayPriceFor(item.name)
            );
            this.appendChild(menuItem);
            menuItems.push(menuItem);
        }
        $('shop-list').scrollTop(0);
        return menuItems;
    }

    public toggle() {
        if (this.parentElement.style.display === 'block') {
            this.hide();
        } else {
            this.show();
        }
    }

    public show() {
        this.parentElement.style.display = 'block';
    }

    public hide() {
        this.parentElement.style.display = 'none';
    }

    public destroy() {
        super.destroy();
        this.key.onDown.remove(this.hide, this);
        this.key = null;
    }
}

export class CraftMenuService extends Service {
    private menuItems: Array<MenuItem> = [];

    public shopMenu: ShopMenu;
    public recentlyMenu: LeftMenu;
    public bottomMenu: BottomMenu;

    public getTooltipFor(buildingType: BuildingType): string {
        let costs = '';
        let config = Config.buildings[BuildingType[buildingType].toLowerCase()];
        for (let key of Object.keys(config.price)) {
            let capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            costs += `<div class="costs"><span>${capitalizedKey}: </span><span>${config.price[key]}</span></div>`;
        }
        return `
            <div class="tooltipheader">${config.name}</div>
            <span>${config.description}</span>
            ${costs}
        `;
    }

    public getDisplayPriceFor(buildingType: BuildingType) {
        let costs = '';
        let config = Config.buildings[BuildingType[buildingType].toLowerCase()];
        for (let key of Object.keys(config.price)) {
            let capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            costs += `<div>${capitalizedKey}: ${config.price[key]}</div>`;
        }
        return costs;
    }

    public getMaxLimit(buildingType: BuildingType) {
        return Config.buildings[BuildingType[buildingType].toLowerCase()].limit;
    }

    public getDisplayNameFor(buildingType: BuildingType) {
        return Config.buildings[BuildingType[buildingType].toLowerCase()].name;
    }

    public getDisplayDescription(buildingType: BuildingType) {
        return Config.buildings[BuildingType[buildingType].toLowerCase()].description;
    }

    public recentlyUsed(item: ShopMenuItem) {
        this.shopMenu.hide();
        this.recentlyMenu.pushRecently(item);
    }

    constructor(world: Game) {
        super(world);
        this.bottomMenu = new BottomMenu('bottom-panel');
        this.menuItems = this.bottomMenu.appendMany(this.world, [
            {
                img: Assets.Images.ImagesWoodwall.getPNG(),
                name: BuildingType.WoodBlock,
                hotKey: "ONE",
                hotKeyDisplay: "1",
                tooltip: this.getTooltipFor(BuildingType.WoodBlock),
                maxLimit: Config.buildings[BuildingType[BuildingType.WoodBlock].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesStonewall.getPNG(),
                name: BuildingType.StoneBlock,
                hotKey: "TWO",
                hotKeyDisplay: "2",
                tooltip: this.getTooltipFor(BuildingType.StoneBlock),
                maxLimit: Config.buildings[BuildingType[BuildingType.StoneBlock].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesDoor.getPNG(),
                name: BuildingType.Door,
                hotKey: "THREE",
                hotKeyDisplay: "3",
                tooltip: this.getTooltipFor(BuildingType.Door),
                maxLimit: Config.buildings[BuildingType[BuildingType.Door].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesGardener.getPNG(),
                name: BuildingType.FarmerBot,
                hotKey: "FOUR",
                hotKeyDisplay: "4",
                tooltip: this.getTooltipFor(BuildingType.FarmerBot),
                maxLimit: Config.buildings[BuildingType[BuildingType.FarmerBot].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesGarden.getPNG(),
                name: BuildingType.Garden,
                hotKey: "FIVE",
                hotKeyDisplay: "5",
                tooltip: this.getTooltipFor(BuildingType.Garden),
                maxLimit: Config.buildings[BuildingType[BuildingType.Garden].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesGuard.getPNG(),
                name: BuildingType.GuardBot,
                hotKey: "SIX",
                hotKeyDisplay: "6",
                tooltip: this.getTooltipFor(BuildingType.GuardBot),
                maxLimit: Config.buildings[BuildingType[BuildingType.GuardBot].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesFollower.getPNG(),
                name: BuildingType.FollowerBot,
                hotKey: "SEVEN",
                hotKeyDisplay: "7",
                tooltip: this.getTooltipFor(BuildingType.FollowerBot),
                maxLimit: Config.buildings[BuildingType[BuildingType.FollowerBot].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesHeartstone.getPNG(),
                name: BuildingType.Heartstone,
                hotKey: "EIGHT",
                hotKeyDisplay: "8",
                tooltip: this.getTooltipFor(BuildingType.Heartstone),
                maxLimit: Config.buildings[BuildingType[BuildingType.Heartstone].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesTower.getPNG(),
                name: BuildingType.Tower,
                hotKey: "NINE",
                hotKeyDisplay: "9",
                tooltip: this.getTooltipFor(BuildingType.Tower),
                maxLimit: Config.buildings[BuildingType[BuildingType.Tower].toLowerCase()].limit
            },
        ]);

        this.recentlyMenu = new LeftMenu('left-panel');
        let leftMenuItems = this.recentlyMenu.appendMany(this.world, [
            {
                img: Assets.Images.ImagesFoodcrate.getPNG(),
                name: BuildingType.FoodCrate,
                hotKey: "Z",
                hotKeyDisplay: "Z",
                tooltip: this.getTooltipFor(BuildingType.FoodCrate),
                maxLimit: Config.buildings[BuildingType[BuildingType.FoodCrate].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesWoodcrate.getPNG(),
                name: BuildingType.WoodCrate,
                hotKey: "X",
                hotKeyDisplay: "X",
                tooltip: this.getTooltipFor(BuildingType.WoodCrate),
                maxLimit: Config.buildings[BuildingType[BuildingType.WoodCrate].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesStonecrate.getPNG(),
                name: BuildingType.StoneCrate,
                hotKey: "C",
                hotKeyDisplay: "C",
                tooltip: this.getTooltipFor(BuildingType.StoneCrate),
                maxLimit: Config.buildings[BuildingType[BuildingType.StoneCrate].toLowerCase()].limit
            },
        ]) as MenuItem[];

        this.shopMenu = new ShopMenu('shop');
        let shopMenuItems = this.shopMenu.appendMany(this, [
            {
                img: Assets.Images.ImagesFoodcrate.getPNG(),
                name: BuildingType.FoodCrate,
                tooltip: this.getTooltipFor(BuildingType.FoodCrate),
                maxLimit: Config.buildings[BuildingType[BuildingType.FoodCrate].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesWoodcrate.getPNG(),
                name: BuildingType.WoodCrate,
                tooltip: this.getTooltipFor(BuildingType.WoodCrate),
                maxLimit: Config.buildings[BuildingType[BuildingType.WoodCrate].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesStonecrate.getPNG(),
                name: BuildingType.StoneCrate,
                tooltip: this.getTooltipFor(BuildingType.StoneCrate),
                maxLimit: Config.buildings[BuildingType[BuildingType.StoneCrate].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesCarwolf.getPNG(),
                name: BuildingType.RideableWolf,
                tooltip: this.getTooltipFor(BuildingType.RideableWolf),
                maxLimit: Config.buildings[BuildingType[BuildingType.RideableWolf].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesPickupbot.getPNG(),
                name: BuildingType.GardenBot,
                tooltip: this.getTooltipFor(BuildingType.GardenBot),
                maxLimit: Config.buildings[BuildingType[BuildingType.GardenBot].toLowerCase()].limit
            },
            {
                img: Assets.Images.ImagesMannequin.getPNG(),
                name: BuildingType.Mannequin,
                tooltip: this.getTooltipFor(BuildingType.Mannequin),
                maxLimit: Config.buildings[BuildingType[BuildingType.Mannequin].toLowerCase()].limit
            }
        ]);

        this.menuItems = this.menuItems.concat(leftMenuItems);
        this.menuItems = this.menuItems.concat(shopMenuItems);

        this.updateAvailability();
    }

    public updateAvailability() {
        let buildingService = this.world.services.getService(BuildingService) as BuildingService;
        // Freaky slow
        for (let menuItem of this.menuItems) {
            menuItem.updateAvailability(buildingService.canBuild(menuItem.name));
        }
    }

    public updateLimit(buildingType: BuildingType, current: number) {
        let buildingService = this.world.services.getService(BuildingService) as BuildingService;
        for (let menuItem of this.menuItems) {
            if (menuItem.name === buildingType) {
                (menuItem as any).updateLimit(current);
                (menuItem as any).updateAvailability(buildingService.canBuild(menuItem.name));
            }
        }
    }

    public updateAllLimits() {
        let childService = this.world.services.getService(ChildService) as ChildService;
        for (let menuItem of this.menuItems) {
            (menuItem as any).updateLimit(childService.getCountForType(BuildingTypeToEntityType(menuItem.name)));
        }
    }

    public cleanup() {
        this.updateAvailability();
    }
}