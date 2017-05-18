import * as Assets from '../assets';
import * as AssetUtils from '../utils/assetUtils';

export default class Crash extends Phaser.State {

    public preload(): void {
    }
    
    public create(): void {
        document.getElementById('crashscreen').style.display = 'block';
    }
}
