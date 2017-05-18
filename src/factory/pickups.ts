import {Entity} from './entity';
import TransformComponent from './components/transform';
import NetworkTransformComponent from './components/networktransform';
import Game from '../states/game';
import SpriteComponent from "./components/sprite";
import * as Assets from '../assets';

export default class Pickup extends Entity {
    constructor(world: Game, id: number, layer: Phaser.Group, atlas: string, center: Phaser.Point) {
        super(world, id, -1);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(layer, atlas, center));
    }
}

export class PigMeatPickup extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesMeat.getName(), new Phaser.Point(0.5, 0.5));
    }
}

export class BearMeatPickup extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesMeat.getName(), new Phaser.Point(0.5, 0.5));
    }
}

export class EggPickup extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesEgg.getName(), new Phaser.Point(0.5, 0.5));
    }
}

export class CarrotPickup extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesCarrot.getName(), new Phaser.Point(0.5, 0.5));
    }
}

export class BoxPickup extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesBox.getName(), new Phaser.Point(0.5, 0.5));
    }
}