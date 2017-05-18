import Game from "../states/game";
import {EventEmitter} from "events";

export class Service extends EventEmitter {
    public world: Game;

    constructor(world: Game) {
        super();
        this.world = world;
    }

    public update(dt: number) {

    }

    public cleanup() {

    }

    public destroy() {

    }
}

export class ServiceManager {
    private services: Array<Service> = [];

    constructor() {

    }

    public registerService(service: Service) {
        this.services.push(service);
    }

    public getService(type: any): Service {
        for (let service of this.services) {
            if (service instanceof type) {
                return service;
            }
        }
        return null;
    }

    public update(dt: number) {
        for (let service of this.services) {
            service.update(dt);
        }
    }

    public cleanup() {
        for (let service of this.services) {
            service.cleanup();
        }
    }

    public destroy() {
        for (let service of this.services) {
            service.destroy();
        }
        this.services = [];
    }
}