import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import Message = Protocol.Message;
import ChildService from "./childservice";
import EntityType = Protocol.EntityType;
import * as Assets from '../assets';
import LevelComponent from "../factory/components/level";
import TransformComponent from "../factory/components/transform";
import Rectangle = Phaser.Rectangle;

export default class MinimapService extends Service {
    private bitmapData: Phaser.BitmapData;
    private preRenderBitmapData: Phaser.BitmapData;
    private image: Phaser.Image;
    private childService: ChildService;
    private x_ratio: number = 150.0 / (400.0 * 64.0);
    private y_ratio: number = 150.0 / (400.0 * 64.0);

    constructor(world: Game) {
        super(world);
        this.bitmapData = this.world.game.add.bitmapData(150, 150);
        this.image = this.bitmapData.addToWorld();
        this.image.fixedToCamera = true;
        this.image.cameraOffset.setTo(15, this.world.game.height - 220);
        this.image.alpha = 0.5;
        this.childService = world.services.getService(ChildService) as ChildService;
        // Pre-rendered map
        this.preRenderBitmapData = this.world.game.add.bitmapData(150, 150);
        this.initializePrerendered();
    }

    private initializePrerendered() {
        this.preRenderBitmapData.clear(0, 0, this.preRenderBitmapData.width, this.preRenderBitmapData.height);
        // Draw trees and stones
        let hash: any = this.world.game.cache.getTilemapData('mapdata').data;
        for (let layer of hash.layers) {
            if (layer.type === 'objectgroup') {
                for (let obj of layer.objects) {
                    let x: number = obj.x;
                    let y: number = obj.y;
                    if (obj.type === 'woodgenerator' || obj.type === 'winterwoodgenerator') {
                        this.preRenderBitmapData.ctx.beginPath();
                        this.preRenderBitmapData.ctx.rect(x * this.x_ratio - 1, y * this.y_ratio - 1, 2, 2);
                        this.preRenderBitmapData.ctx.fillStyle = '#00ff00';
                        this.preRenderBitmapData.ctx.fill();
                    } else if (obj.type === 'stonegenerator' || obj.type === 'winterstonegenerator') {
                        this.preRenderBitmapData.ctx.beginPath();
                        this.preRenderBitmapData.ctx.rect(x * this.x_ratio - 1, y * this.y_ratio - 1, 2, 2);
                        this.preRenderBitmapData.ctx.fillStyle = '#ffffff';
                        this.preRenderBitmapData.ctx.fill();
                    }
                }
            }
        }
    }

    public onMapMessage(msg: Message) {
        this.bitmapData.clear(0, 0, this.bitmapData.width, this.bitmapData.height);
        this.bitmapData.ctx.beginPath();
        this.bitmapData.ctx.rect(0, 0, 150, 150);
        this.bitmapData.ctx.fillStyle = '#222222';
        this.bitmapData.ctx.fill();
        this.bitmapData.copyRect(this.preRenderBitmapData, new Rectangle(0, 0, this.bitmapData.width, this.bitmapData.height), 0, 0, 0.2);
        for (let i = 0; i < this.childService.childs.length; i++) {
            let child = this.childService.childs[i];
            let x = child.position.x * this.x_ratio;
            let y = child.position.y * this.y_ratio;
            let type = child.objectType;
            if (type === EntityType.Tower) {
                this.bitmapData.ctx.beginPath();
                this.bitmapData.ctx.rect(x - 3, y - 3, 6, 6);
                this.bitmapData.ctx.fillStyle = '#aaaaaa';
                this.bitmapData.ctx.fill();
            } else if (type === EntityType.StoneBlock || type === EntityType.WoodBlock) {
                this.bitmapData.ctx.beginPath();
                this.bitmapData.ctx.rect(x - 1, y - 1, 2, 2);
                this.bitmapData.ctx.fillStyle = '#aaaaaa';
                this.bitmapData.ctx.fill();
            }
        }

        let data = msg.content['data'];
        let team_data = msg.content['teamData'];
        /*
        if (this.world.assignedObject) {
            let levelComponent = this.world.assignedObject.components.level as LevelComponent;
            let transformComponent = this.world.assignedObject.components.transform as TransformComponent;
            if (levelComponent && transformComponent && levelComponent.currentLevel < 1) {
                // Draw player byself
                this.bitmapData.ctx.beginPath();
                this.bitmapData.ctx.rect(transformComponent.position.x * this.x_ratio - 4, transformComponent.position.y * this.y_ratio - 4, 10, 10);
                this.bitmapData.ctx.fillStyle = '#00ff00';
                this.bitmapData.ctx.fill();
            }
        }
        */

        for (let i = 0; i < data.length; i += 4) {
            let id: number = data[i];
            let x: number = data[i + 1] * this.x_ratio;
            let y: number = data[i + 2] * this.y_ratio;
            let level: number = data[i + 3];
            let teamId: string = team_data[i / 4];
            this.bitmapData.ctx.beginPath();
            if (this.world.networkId === id) {
                this.bitmapData.ctx.rect(x - 4, y - 4, 10, 10);
                this.bitmapData.ctx.fillStyle = '#00ff00';
            } else if (this.world.teamId === teamId) {
                this.bitmapData.ctx.rect(x - 2, y - 2, 6, 6);
                this.bitmapData.ctx.fillStyle = '#00ff00';
            } else if (level > 0) {
                this.bitmapData.ctx.rect(x - 1, y - 1, 4, 4);
                this.bitmapData.ctx.fillStyle = '#ff0000';
            }
            this.bitmapData.ctx.fill();
        }
    }

    public update(dt: number) {
        for (let child of this.childService.childs) {
            if (child.objectType === EntityType.WoodBlock || child.objectType === EntityType.Tower || child.objectType === EntityType.StoneBlock) {

            }
        }
        this.image.cameraOffset.setTo(15, this.world.game.height - 220);
    }

    public destroy() {
        this.image.destroy();
        this.bitmapData.destroy();
    }
}