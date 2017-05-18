import {Entity} from "./entity";
import TransformComponent from "./components/transform";
import NetworkTransformComponent from "./components/networktransform";
import SpriteComponent from "./components/sprite";
import Game from "../states/game";
import * as Assets from '../assets';
import JumpOnHitComponent from "./components/jumponhit";

export class WoodGenerator extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_FOREGROUND_0, Assets.Images.ImagesWoodgenerator.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class StoneGenerator extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_BACKGROUND_0, Assets.Images.ImagesStonegenerator.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class WinterWoodGenerator extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_FOREGROUND_0, Assets.Images.ImagesWinterwoodgenerator.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class WinterStoneGenerator extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_BACKGROUND_0, Assets.Images.ImagesWinterstonegenerator.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}