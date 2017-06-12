import {Entity} from "./entity";
import TransformComponent from "./components/transform";
import NetworkTransformComponent from "./components/networktransform";
import SpriteComponent from "./components/sprite";
import Game from "../states/game";
import * as Assets from '../assets';
import JumpOnHitComponent from "./components/jumponhit";
import DoorAnimatorComponent from "./components/dooranimator";
import BallAnimatorComponent from "./components/ballanimator";

export class WoodBlock extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_FOREGROUND_0, Assets.Images.ImagesWoodwall.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class StoneBlock extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_FOREGROUND_0, Assets.Images.ImagesStonewall.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class Door extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_0, Assets.Atlases.AtlasesDoor.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new DoorAnimatorComponent());
        this.addComponent(new JumpOnHitComponent());
    }
}

export class Garden extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_BACKGROUND_0, Assets.Images.ImagesGarden.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class WoodSpikes extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_BACKGROUND_0, Assets.Images.ImagesWoodspikes.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class Portal extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_BACKGROUND_0, Assets.Images.ImagesPortal.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class Tower extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_FOREGROUND_0, Assets.Images.ImagesTower.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class Heartstone extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_FOREGROUND_0, Assets.Images.ImagesHeartstone.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class FoodCrate extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_1, Assets.Images.ImagesFoodcrate.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class WoodCrate extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_1, Assets.Images.ImagesWoodcrate.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class StoneCrate extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_1, Assets.Images.ImagesStonecrate.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}

export class Mannequin extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_0, Assets.Images.ImagesMannequin.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new JumpOnHitComponent());
    }
}


export class SoccerBall extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent(true, false));
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_0, Assets.Images.ImagesSoccerball.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new BallAnimatorComponent());
    }
}