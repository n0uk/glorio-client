import {Entity, Component} from './entity';
import TransformComponent from './components/transform';
import NetworkTransformComponent from './components/networktransform';
import Game from '../states/game';
import SpriteComponent from "./components/sprite";
import * as Assets from '../assets';
import FriendlyAnimalAnimatorComponent from "./components/friendlyanimalanimator";
import HealthComponent from "./components/health";
import AngryAnimalAnimatorComponent from "./components/angryanimalanimator";
import RedOnHitComponent from "./components/redonhit";
import PlayerAnimatorComponent from "./components/playeranimator";

export class WhiteWalker extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_1, Assets.Atlases.AtlasesWhitewalker.getName(), new Phaser.Point(0.5, 0.55)));
        this.addComponent(new PlayerAnimatorComponent());
        this.addComponent(new HealthComponent(100));
        this.addComponent(new RedOnHitComponent());
    }
}

export class Pig extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_0, Assets.Atlases.AtlasesPig.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new FriendlyAnimalAnimatorComponent());
        this.addComponent(new RedOnHitComponent());
    }
}

export class Chicken extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_0, Assets.Atlases.AtlasesChicken.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new FriendlyAnimalAnimatorComponent());
        this.addComponent(new RedOnHitComponent());
    }
}

export class Wolf extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_0, Assets.Atlases.AtlasesWolf.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new AngryAnimalAnimatorComponent());
        this.addComponent(new HealthComponent(50));
        this.addComponent(new RedOnHitComponent());
    }
}

export class Bear extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_0, Assets.Atlases.AtlasesBear.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new AngryAnimalAnimatorComponent());
        this.addComponent(new HealthComponent(50));
        this.addComponent(new RedOnHitComponent());
    }
}

export class WhiteBear extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_0, Assets.Atlases.AtlasesWhitebear.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new AngryAnimalAnimatorComponent());
        this.addComponent(new HealthComponent(50));
        this.addComponent(new RedOnHitComponent());
    }
}

export class RideablePig extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_0, Assets.Atlases.AtlasesCarpig.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new FriendlyAnimalAnimatorComponent());
    }
}


export class RideableWolf extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_0, Assets.Atlases.AtlasesCarwolf.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new FriendlyAnimalAnimatorComponent());
    }
}

export class RideableBear extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_0, Assets.Atlases.AtlasesRideablebear.getName(), new Phaser.Point(0.5, 0.5)));
        this.addComponent(new FriendlyAnimalAnimatorComponent());
    }
}