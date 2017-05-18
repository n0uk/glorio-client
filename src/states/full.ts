import * as Assets from '../assets';
import * as AssetUtils from '../utils/assetUtils';

export default class Full extends Phaser.State {

    public preload(): void {
    }
    
    public create(): void {
        document.getElementById('serverfullscreen').style.display = 'block';
    }
}
