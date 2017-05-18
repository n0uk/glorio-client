import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import Message = Protocol.Message;
import EntityType = Protocol.EntityType;
import EntityTypeToBuildingType = Protocol.EntityTypeToBuildingType;
import BuildingType = Protocol.BuildingType;
import {CraftMenuService} from "./craftmenuservice";

class Child {
    public id: number;
    public objectType: EntityType;
    public position: Phaser.Point;

    constructor(id: number, objectType: EntityType, position: Phaser.Point) {
        this.id = id;
        this.objectType = objectType;
        this.position = position;
    }
}

export default class ChildService extends Service {

    public childs: Array<Child> = [];
    public typeCounts: Map<number> = {};

    constructor(world: Game) {
        super(world);
    }

    public onCreateChild(message: Message) {
        let objectType = message.content['objectType'];
        this.childs.push(new Child(message.content['id'], objectType, new Phaser.Point(message.content['x'], message.content['y'])));
        if (this.typeCounts.hasOwnProperty(objectType)) {
            this.typeCounts[objectType]++;
        } else {
            this.typeCounts[objectType] = 1;
        }

        (this.world.services.getService(CraftMenuService) as CraftMenuService).updateLimit(EntityTypeToBuildingType(objectType), this.typeCounts[objectType]);
    }

    public onRemoveChild(message: Message) {
        let id: number = message.content['id'];
        let objectType = message.content['objectType'];
        for (let i = 0; i < this.childs.length; i++) {
            if (this.childs[i].id === id) {
                this.typeCounts[objectType]--;
                this.childs.splice(i, 1);
                break;
            }
        }

        (this.world.services.getService(CraftMenuService) as CraftMenuService).updateLimit(EntityTypeToBuildingType(objectType), this.typeCounts[objectType]);
    }

    public getCountForType(objectType: EntityType) {
        return this.typeCounts.hasOwnProperty(objectType.toString()) ? this.typeCounts[objectType] : 0;
    }

    public cleanup() {
        this.childs = [];
        this.typeCounts = {};
        (this.world.services.getService(CraftMenuService) as CraftMenuService).updateAllLimits();
    }
}