import {Service} from "./servicemanager";
import Game from "../states/game";
import * as Assets from '../assets';
import ResourceService from "./resources";
import ChildService from "./childservice";
import {Protocol} from "../protocol/protocol";
import EntityType = Protocol.EntityType;
import BuildingType = Protocol.BuildingType;
import BuildingTypeToEntityType = Protocol.BuildingTypeToEntityType;
import TransformComponent from "../factory/components/transform";
import MapService from "./mapservice";
import MessageType = Protocol.MessageType;
import {Message} from "protobufjs";
import NetworkInputComponent from "../factory/components/networkinput";

export let BuildingDefinitions: any = {
    "WoodBlock": {
        icon: Assets.Images.ImagesWoodwall.getPNG(),
        spriteName: Assets.Images.ImagesWoodwall.getName(),
        scale: 1
    },
    'StoneBlock': {
        icon: Assets.Images.ImagesStonewall.getPNG(),
        spriteName: Assets.Images.ImagesStonewall.getName(),
        scale: 1
    },
    'DarkStoneBlock': {
        icon: Assets.Images.ImagesDarkstonewall.getPNG(),
        spriteName: Assets.Images.ImagesDarkstonewall.getName(),
        scale: 1
    },
    'Garden': {
        icon: Assets.Images.ImagesGarden.getPNG(),
        spriteName: Assets.Images.ImagesGarden.getName(),
        scale: 1
    },
    'Tower': {
        icon: Assets.Images.ImagesTower.getPNG(),
        spriteName: Assets.Images.ImagesTower.getName(),
        scale: 1
    },
    'Heartstone': {
        icon: Assets.Images.ImagesHeartstone.getPNG(),
        spriteName: Assets.Images.ImagesHeartstone.getName(),
        scale: 1
    },
    'GuardBot': {
        icon: Assets.Images.ImagesGuard.getPNG(),
        spriteName: Assets.Images.ImagesGuard.getName(),
        scale: 0.7
    },
    'DarkGuardBot': {
        icon: Assets.Images.ImagesDarkguard.getPNG(),
        spriteName: Assets.Images.ImagesDarkguard.getName(),
        scale: 0.7
    },
    'FollowerBot': {
        icon: Assets.Images.ImagesFollower.getPNG(),
        spriteName: Assets.Images.ImagesFollower.getName(),
        scale: 0.7
    },
    'FarmerBot': {
        icon: Assets.Images.ImagesGardener.getPNG(),
        spriteName: Assets.Images.ImagesGardener.getName(),
        scale: 0.7
    },
    'GardenBot': {
        icon: Assets.Images.ImagesPickupbot.getPNG(),
        spriteName: Assets.Images.ImagesPickupbot.getName(),
        scale: 0.7
    },
    'Door': {
        icon: Assets.Images.ImagesDoor.getPNG(),
        spriteName: Assets.Images.ImagesDoor.getName(),
        scale: 1
    },
    'DarkDoor': {
        icon: Assets.Images.ImagesDarkdoor.getPNG(),
        spriteName: Assets.Images.ImagesDarkdoor.getName(),
        scale: 1
    },
    'FoodCrate': {
        icon: Assets.Images.ImagesFoodcrate.getPNG(),
        spriteName: Assets.Images.ImagesFoodcrate.getName(),
        scale: 1
    },
    'WoodCrate': {
        icon: Assets.Images.ImagesWoodcrate.getPNG(),
        spriteName: Assets.Images.ImagesWoodcrate.getName(),
        scale: 1
    },
    'StoneCrate': {
        icon: Assets.Images.ImagesStonecrate.getPNG(),
        spriteName: Assets.Images.ImagesStonecrate.getName(),
        scale: 1
    },
    'RideableWolf': {
        icon: Assets.Images.ImagesCarwolf.getPNG(),
        spriteName: Assets.Images.ImagesCarwolf.getName(),
        scale: 1
    },
    'RideableBear': {
        icon: Assets.Images.ImagesRideablebear.getPNG(),
        spriteName: Assets.Images.ImagesRideablebear.getName(),
        scale: 1
    },
    'Mannequin': {
        icon: Assets.Images.ImagesMannequin.getPNG(),
        spriteName: Assets.Images.ImagesMannequin.getName(),
        scale: 1
    },
    'SoccerBall': {
        icon: Assets.Images.ImagesSoccerball.getPNG(),
        spriteName: Assets.Images.ImagesSoccerball.getName(),
        scale: 1
    },
    'WoodSpikes': {
        icon: Assets.Images.ImagesWoodspikes.getPNG(),
        spriteName: Assets.Images.ImagesWoodspikes.getName(),
        scale: 1
    },
    'Portal': {
        icon: Assets.Images.ImagesPortal.getPNG(),
        spriteName: Assets.Images.ImagesPortal.getName(),
        scale: 1
    },
};

export default class BuildingService extends Service {

    private currentBuildingId: BuildingType = null;
    private currentBuildingSprite: Phaser.Sprite = null;
    private currentBuildingPosition: Phaser.Point = new Phaser.Point(0, 0);
    private escapeKey: Phaser.Key;

    constructor(world: Game) {
        super(world);
        this.world.game.input.onDown.add(this.onMouseDown, this);
        this.escapeKey = this.world.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    }

    public inProgress() {
        return this.currentBuildingSprite != null;
    }

    private onMouseDown(event: Event) {
        if (this.inProgress()) {
            let isLeftButton: boolean = this.world.game.input.activePointer.leftButton.isDown;
            let isRightButton: boolean = this.world.game.input.activePointer.rightButton.isDown;
            if (isLeftButton) {
                this.commitBuild();
            } else if (isRightButton) {
                this.cancelBuild();
            }
            // event.stopPropagation();
        }
    }

    public requestWork(buildingId: BuildingType) {
        if (this.inProgress()) {
            this.cancelBuild();
        } else {
            if (this.canBuild(buildingId)) {
                this.startBuild(buildingId);
            }
        }
    }

    public startBuild(buildingId: BuildingType) {
        this.currentBuildingId = buildingId;
        this.currentBuildingSprite = this.world.LAYER_FOREGROUND_0.create(this.world.game.input.activePointer.worldX,
            this.world.game.input.activePointer.worldY,
            BuildingDefinitions[BuildingType[buildingId]].spriteName);

        let scale = BuildingDefinitions[BuildingType[buildingId]].scale;
        this.currentBuildingSprite.scale.set(scale, scale);
        this.currentBuildingSprite.tint = 0xff9999;
        this.currentBuildingSprite.anchor.set(0.5, 0.5);
    }

    public canBuild(buildingId: BuildingType): boolean {
        let buildingName = BuildingType[buildingId].toLowerCase();

        let price = Config.buildings[buildingName].price;
        let limit = Config.buildings[buildingName].limit;
        let resourceService = this.world.services.getService(ResourceService) as ResourceService;
        let childService = this.world.services.getService(ChildService) as ChildService;

        return resourceService.hasResources(price) && childService.getCountForType(BuildingTypeToEntityType(buildingId)) < limit;
    }

    public update(dt: number) {
        if (this.inProgress()) {
            let currentPlayerPosition = (this.world.assignedObject.components.transform as TransformComponent).position;

            this.currentBuildingPosition.x = this.world.game.input.activePointer.worldX;
            this.currentBuildingPosition.y = this.world.game.input.activePointer.worldY;

            // Get direction
            this.currentBuildingPosition.x = this.currentBuildingPosition.x - currentPlayerPosition.x;
            this.currentBuildingPosition.y = this.currentBuildingPosition.y - currentPlayerPosition.y;

            let magnitude: number = this.currentBuildingPosition.getMagnitude();
            if (magnitude > Config.client.build_radius) {
                magnitude = Config.client.build_radius;
            }

            this.currentBuildingPosition.normalize();

            // New vector
            this.currentBuildingPosition.multiply(magnitude, magnitude);

            this.currentBuildingPosition.add(currentPlayerPosition.x, currentPlayerPosition.y);

            let tileWidth: number = (this.world.services.getService(MapService) as MapService).tileWidth;
            let tileHeight: number = (this.world.services.getService(MapService) as MapService).tileHeight;
            let halfTileWidth: number = tileWidth / 2;
            let halfTileHeight: number = tileHeight / 2;

            // Aligning
            if (Config.buildings[BuildingType[this.currentBuildingId].toLowerCase()].radius || Config.buildings[BuildingType[this.currentBuildingId].toLowerCase()].subtile) {
                // Subtile based
                this.currentBuildingPosition.x = Math.floor(this.currentBuildingPosition.x / halfTileWidth) * halfTileWidth;
                this.currentBuildingPosition.y = Math.floor(this.currentBuildingPosition.y / halfTileHeight) * halfTileHeight;
            } else {
                // Tile based
                this.currentBuildingPosition.x = Math.floor(this.currentBuildingPosition.x / tileWidth) * tileWidth + halfTileWidth;
                this.currentBuildingPosition.y = Math.floor(this.currentBuildingPosition.y / tileHeight) * tileHeight + halfTileHeight;
            }

            this.currentBuildingSprite.position.copyFrom(this.currentBuildingPosition);

            if (this.escapeKey.isDown) {
                this.cancelBuild();
            }
        }
    }

    public commitBuild() {
        this.world.socket.sendMessage(MessageType.PlayerBuildRequest, {
            buildingType: this.currentBuildingId,
            x: this.currentBuildingPosition.x,
            y: this.currentBuildingPosition.y
        });
        if (this.world.assignedObject) {
            if (this.world.assignedObject.components.networkinput) {
                (this.world.assignedObject.components.networkinput as NetworkInputComponent).lockPunchUntilMouseUp();
            }
        }
        // console.log("Commit build: " + this.currentBuildingId);
    }

    public cancelBuild() {
        if (this.currentBuildingSprite) {
            this.currentBuildingSprite.destroy();
            this.currentBuildingSprite = null;
        }
    }

    public onBuildResponse(message: Message) {
        if (message['success']) {
            this.cancelBuild();
        }
    }

    public destroy() {
        this.cancelBuild();
        this.world.game.input.onDown.remove(this.onMouseDown, this);
    }
}