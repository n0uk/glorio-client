import Game from '../states/game';
import {EventEmitter} from 'events';

export class Component extends EventEmitter {
    public entity: Entity;
    public world: Game;
    // Allow access to component by entity.componentId
    public id: string;

    constructor() {
        super();
    }

    public start() {

    }

    public update(dt: number) {

    }

    public destroy() {

    }
}

export class Entity extends EventEmitter {
    private _components: Array<Component> = [];
    public components: Map<Component> = {};
    public world: Game;
    public id: number;
    public parentId: number;

    constructor(world: Game, id: number, parentId: number) {
        super();
        this.world = world;
        this.id = id;
        this.parentId = parentId;
    }

    public addComponent(component: Component): Component {
        this._components.push(component);
        if (component.id) {
            this.components[component.id] = component;
        }
        component.entity = this;
        component.world = this.world;
        component.start();
        return component;
    }

    public update(dt: number) {
        for (let component of this._components) {
            component.update(dt);
        }
    }

    public destroy() {
        while (this._components.length > 0) {
            this._components.pop().destroy();
        }
        this.components = {};
    }

    public isLocalPlayer(): boolean {
        return this.id === this.world.networkId;
    }
}