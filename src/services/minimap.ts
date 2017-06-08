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
import LeaderboardService from "./leaderboards";
import DayTimeService from "./daytime";

export default class MinimapService extends Service {
    private bitmapData: Phaser.BitmapData;
    private preRenderBitmapData: Phaser.BitmapData;
    private image: Phaser.Image;
    private childService: ChildService;
    private x_ratio: number = 150.0 / (400.0 * 64.0);
    private y_ratio: number = 150.0 / (400.0 * 64.0);
    private minimapWinnerImage: Phaser.Image;

    constructor(world: Game) {
        super(world);
        this.minimapWinnerImage = this.world.game.make.image(0, 0, Assets.Images.ImagesMinimapwinner.getName());
        this.bitmapData = this.world.game.add.bitmapData(150, 150);
        this.image = this.bitmapData.addToWorld();
        this.image.fixedToCamera = true;
        this.image.cameraOffset.setTo(15, this.world.game.height - 170);
        this.image.alpha = 0.7;
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
        let topId = (this.world.services.getService(LeaderboardService) as LeaderboardService).topId;
        let isNight = (this.world.services.getService(DayTimeService) as DayTimeService).isNight();

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
        let team_data = msg.content['teamIdData'];

        for (let i = 0; i < data.length; i += 4) {
            let id: number = data[i];
            let x: number = data[i + 1] * this.x_ratio;
            let y: number = data[i + 2] * this.y_ratio;
            let level: number = data[i + 3];
            let teamId: number = team_data[i / 4];
            if (id !== topId) {
                this.bitmapData.ctx.beginPath();
                if (teamId === -2) {
                    // White Walker
                    if (isNight) {
                        this.bitmapData.ctx.rect(x - 4, y - 4, 10, 10);
                        this.bitmapData.ctx.fillStyle = '#ffffff';
                    }
                } else if (this.world.id === id) {
                    this.bitmapData.ctx.rect(x - 4, y - 4, 10, 10);
                    if (level < 0) {
                        // Hat effect
                        this.bitmapData.ctx.fillStyle = '#00aa00';
                    } else {
                        this.bitmapData.ctx.fillStyle = '#00ff00';
                    }
                } else if (this.world.teamId === teamId && teamId > -1) {
                    this.bitmapData.ctx.rect(x - 2, y - 2, 6, 6);
                    this.bitmapData.ctx.fillStyle = '#00bb00';
                } else if (level > 0 && !isNight) {
                    this.bitmapData.ctx.rect(x - 1, y - 1, 4, 4);
                    this.bitmapData.ctx.fillStyle = '#ff0000';
                }

                this.bitmapData.ctx.fill();
            }
            if (topId === id) {
                this.bitmapData.draw(this.minimapWinnerImage, x - 5 , y - 5, 10, 10);
            }
        }
    }

    public update(dt: number) {
        for (let child of this.childService.childs) {
            if (child.objectType === EntityType.WoodBlock || child.objectType === EntityType.Tower || child.objectType === EntityType.StoneBlock) {

            }
        }
        this.image.cameraOffset.setTo(20, this.world.game.height - 170);
    }

    public destroy() {
        this.image.destroy();
        this.bitmapData.destroy();
    }
}