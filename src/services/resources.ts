import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import ResourceType = Protocol.ResourceType;
import ParseResourceType = Protocol.ParseResourceType;
import {CraftMenuService} from "./craftmenuservice";

export default class ResourceService extends Service {
    public currentResources: Array<number> = [0, 0, 0, 0];

    private container: HTMLElement;
    private elements: Array<HTMLElement> = [];

    public constructor(world: Game) {
        super(world);

        this.container = document.getElementById('respanel');

        for (let resource in ResourceType) {
            // isNaN(parseInt()) - Really? Yep.
            if (isNaN(parseInt(resource))) {
                let resourceElement: HTMLDivElement = document.createElement('div') as HTMLDivElement;
                resourceElement.innerText = `${resource}: 0`;
                this.elements.push(resourceElement);

                this.container.appendChild(resourceElement);
            }
        }

        this.toggle(true);
    }

    public toggle(flag: boolean) {
        this.container.style.display = flag ? 'block' : 'none';
    }

    public sync(counts: Array<number>) {
        this.currentResources = counts;
        for (let idx in this.elements) {
            this.elements[idx].innerText = `${ResourceType[idx]}: ${counts[idx]}`;
        }
        (this.world.services.getService(CraftMenuService) as CraftMenuService).updateAvailability();
    }

    public hasResources(resources: any): boolean {
        for (let resource of Object.keys(resources)) {
            let resourceType = ParseResourceType(resource);
            if (this.currentResources[resourceType] < resources[resource]) {
                return false;
            }
        }
        return true;
    }

    public destroy() {
        this.container.innerHTML = '';
    }
}