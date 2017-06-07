import {Entity} from "./entity";
import TransformComponent from "./components/transform";
import NetworkTransformComponent from "./components/networktransform";
import SpriteComponent from "./components/sprite";
import Game from "../states/game";
import * as Assets from '../assets';

export class WinterWall extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_FOREGROUND_0, Assets.Images.ImagesWinterwall.getName(), new Phaser.Point(0.5, 0.5)));
    }
}

export class WinterFloor extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_BACKGROUND_0, Assets.Images.ImagesWinterfloor.getName(), new Phaser.Point(0.5, 0.5)));
    }
}
