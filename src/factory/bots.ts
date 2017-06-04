import {Entity, Component} from './entity';
import TransformComponent from './components/transform';
import NetworkTransformComponent from './components/networktransform';
import Game from '../states/game';
import SpriteComponent from "./components/sprite";
import PlayerAnimatorComponent from "./components/playeranimator";
import LevelComponent from "./components/level";
import * as Assets from '../assets';
import HealthComponent from "./components/health";
import RedOnHitComponent from "./components/redonhit";
import TeamComponent from "./components/teamcomponent";
import PlayerLabelComponent from "./components/playerlabel";

export class FollowerBot extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_1, Assets.Atlases.AtlasesKnight.getName(), new Phaser.Point(0.485, 0.533)));
        this.addComponent(new PlayerAnimatorComponent());
        this.addComponent(new LevelComponent());
        this.addComponent(new HealthComponent(50));
        this.addComponent(new RedOnHitComponent());
        this.addComponent(new TeamComponent());
        if (parentId === world.id) {
            (this.addComponent(new PlayerLabelComponent(50)) as PlayerLabelComponent).setPlayerName("Mercenary");
        }
    }
}

export class FarmerBot extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_1, Assets.Atlases.AtlasesGardener.getName(), new Phaser.Point(0.485, 0.533)));
        this.addComponent(new PlayerAnimatorComponent());
        this.addComponent(new LevelComponent());
        this.addComponent(new HealthComponent(50));
        this.addComponent(new RedOnHitComponent());
        this.addComponent(new TeamComponent());
        if (parentId === world.id) {
            (this.addComponent(new PlayerLabelComponent(50)) as PlayerLabelComponent).setPlayerName("Peasant");
        }
    }
}


export class GuardBot extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_1, Assets.Atlases.AtlasesGuard.getName(), new Phaser.Point(0.485, 0.533)));
        this.addComponent(new PlayerAnimatorComponent());
        this.addComponent(new LevelComponent());
        this.addComponent(new HealthComponent(50));
        this.addComponent(new RedOnHitComponent());
        this.addComponent(new TeamComponent());
        if (parentId === world.id) {
            (this.addComponent(new PlayerLabelComponent(50)) as PlayerLabelComponent).setPlayerName("Guard");
        }
    }
}

export class GardenBot extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_1, Assets.Atlases.AtlasesPickupbot.getName(), new Phaser.Point(0.485, 0.533)));
        this.addComponent(new PlayerAnimatorComponent());
        this.addComponent(new LevelComponent());
        this.addComponent(new HealthComponent(50));
        this.addComponent(new RedOnHitComponent());
        this.addComponent(new TeamComponent());
        if (parentId === world.id) {
            (this.addComponent(new PlayerLabelComponent(50)) as PlayerLabelComponent).setPlayerName("Gardener");
        }
    }
}