import {Service} from "./servicemanager";
import Game from "../states/game";
import ServerManager from "../servermanager";


export default class ServerSelectionService extends Service {
    private container: HTMLSelectElement;

    public constructor(world: Game, data: any) {
        super(world);

        this.container = document.getElementById('server-select') as HTMLSelectElement;
        let innerHTML = [];
        let cities = [];
        let sum: number = 0;
        for (let record of data) {
            if (record.status) {
                let city = record.name.split('-')[0];
                let index = record.name.split('-')[1];
                city = city.charAt(0).toUpperCase() + city.slice(1);
                if (cities.indexOf(city) < 0) {
                    innerHTML.push(`<option disabled>${city}</option>`);
                    cities.push(city);
                }

                if (record.host === ServerManager.getHostAddressRaw().split(':')[0]) {
                    innerHTML.push(`<option selected value="${record.host}">${city} #${index} [${record.clients}/100]</option>`);
                } else {
                    innerHTML.push(`<option value="${record.host}">${city} #${index} [${record.clients}/100]</option>`);
                }
                sum += record.clients;
            }
        }
        innerHTML.push(`<option disabled>Total players: ${sum}</option>`);
        this.container.innerHTML = innerHTML.join('');
        this.container.addEventListener('change', function () {
            try {
                window.location.href = '/?ip=' + this.container.options[this.container.selectedIndex].value + ':5000';
            } catch (e) {

            }
        }.bind(this));
    }
}