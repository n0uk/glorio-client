import {Entity, Component} from './entity';
import TransformComponent from './components/transform';
import NetworkTransformComponent from './components/networktransform';
import NetworkInputComponent from './components/networkinput';
import Game from '../states/game';
import SpriteComponent from "./components/sprite";
import PlayerAnimatorComponent from "./components/playeranimator";
import LevelComponent from "./components/level";
import * as Assets from '../assets';
import HealthComponent from "./components/health";
import ChatBubbleComponent from "./components/chatbubble";
import ChatInputComponent from "./components/chatinput";
import PlayerLabelComponent from "./components/playerlabel";
import RedOnHitComponent from "./components/redonhit";
import TeamComponent from "./components/teamcomponent";

export default class Player extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
        this.addComponent(new SpriteComponent(world.LAYER_MIDDLE_1, Assets.Atlases.AtlasesKnight.getName(), new Phaser.Point(0.485, 0.533)));
        this.addComponent(new PlayerAnimatorComponent());
        this.addComponent(new LevelComponent());
        this.addComponent(new HealthComponent(50));
        this.addComponent(new ChatBubbleComponent(50));
        this.addComponent(new PlayerLabelComponent(50));
        this.addComponent(new RedOnHitComponent());
        if (this.isLocalPlayer()) {
            this.addComponent(new NetworkInputComponent());
            this.addComponent(new ChatInputComponent(50));
        }
        this.addComponent(new TeamComponent());
    }
}