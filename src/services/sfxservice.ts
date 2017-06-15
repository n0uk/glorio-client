import {Service} from "./servicemanager";
import Game from "../states/game";
import * as Assets from '../assets';

export default class SFXService extends Service {

    public constructor(world: Game) {
        super(world);
        this.world.game.add.audio(Assets.Audio.SfxWhoosh1.getName(), 1.0, false, false);
    }

    public play(name: string) {
        this.world.game.sound.play(name);
    }

    public toggle(flag: boolean) {
        this.world.game.sound.mute = !flag;
    }

    public destroy() {

    }
}