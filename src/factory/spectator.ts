import {Entity, Component} from './entity';
import TransformComponent from './components/transform';
import NetworkTransformComponent from './components/networktransform';
import Game from '../states/game';

export default class Spectator extends Entity {
    constructor(world: Game, id: number, parentId: number) {
        super(world, id, parentId);
        this.addComponent(new TransformComponent());
        this.addComponent(new NetworkTransformComponent());
    }
}