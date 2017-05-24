import * as Assets from '../assets';
import * as AssetUtils from '../utils/assetUtils';

export default class Kicked extends Phaser.State {

    public preload(): void {
    }

    public create(): void {
        document.getElementById('kickedscreen').style.display = 'block';
    }
}
