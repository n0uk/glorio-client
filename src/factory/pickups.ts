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

export class SoulPickup extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesSoul.getName(), new Phaser.Point(0.5, 0.5));
    }
}

export class CarrotPickup extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_1, Assets.Images.ImagesCarrot.getName(), new Phaser.Point(0.5, 0.5));
    }
}

export class BoxPickup extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesBox.getName(), new Phaser.Point(0.5, 0.5));
    }
}

export class CoinPickup extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesCoin.getName(), new Phaser.Point(0.5, 0.5));
    }
}

export class WhiteBearHat extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesWhitebearhat.getName(), new Phaser.Point(0.5, 0.5));
    }
}

export class BrownBearHat extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesBrownbearhat.getName(), new Phaser.Point(0.5, 0.5));
    }
}


export class ChessHat extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesChesshat.getName(), new Phaser.Point(0.5, 0.5));
    }
}

export class CowboyHat extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesCowboyhat.getName(), new Phaser.Point(0.5, 0.5));
    }
}

export class ChickenHat extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesChickenhat.getName(), new Phaser.Point(0.5, 0.5));
    }
}

export class VikingHat extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesVikinghat.getName(), new Phaser.Point(0.5, 0.5));
    }
}
export class FoxHat extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesFoxhat.getName(), new Phaser.Point(0.5, 0.5));
    }
}
export class BuilderHat extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesBuilderhat.getName(), new Phaser.Point(0.5, 0.5));
    }
}
export class HockeyHat extends Pickup {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, world.LAYER_BACKGROUND_0, Assets.Images.ImagesHockeyhat.getName(), new Phaser.Point(0.5, 0.5));
    }
}