import {Service} from "./servicemanager";
import Game from "../states/game";
import {Protocol} from "../protocol/protocol";
import ResourceType = Protocol.ResourceType;
import * as Assets from '../assets';

export default class FloatResourcesService extends Service {
    public currentResources: Array<number>;

    public constructor(world: Game) {
        super(world);
    }

    public float(x: number, y: number, resources: Array<number>) {
        let k = 0;
        for (let i = 0; i < resources.length; i++) {
            let resType: number = i;
            let resCount: number = resources[i];
            if (resCount > 0) {
                this.world.game.time.events.add(Phaser.Timer.SECOND * 0.4 * k, function () {
                    this._float(x, y, resType, resCount);
                }, this);
                k++;
            }
        }
    }

    private _float(x: number, y: number, type: number, count: number): void {
        let label = this.world.game.add.text(x, y, `+${count} ${ResourceType[type]}`, {
            font: '20px ' + Assets.GoogleWebFonts.RobotoMono
        });
        label.anchor.set(0.5, 1);
        // Stroke color and thickness
        label.stroke = '#000000';
        label.strokeThickness = 3;
        label.fill = '#00ff00';
        let tween = this.world.game.add.tween(label);
        tween.to({y: label.y - 60});
        tween.onComplete.add(function () {
            label.destroy();
        }, this);
        tween.start();
    }
}