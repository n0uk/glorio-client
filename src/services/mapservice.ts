import {Service} from "./servicemanager";
import Game from "../states/game";

export default class MapService extends Service {
    public tileWidth: number;
    public tileHeight: number;
    public tileWidthCount: number;
    public tileHeightCount: number;

    public constructor(world: Game) {
        super(world);
        let map = this.world.game.add.tilemap('mapdata');

        this.tileWidth = map.tileWidth;
        this.tileHeight = map.tileHeight;
        this.tileWidthCount = map.width;
        this.tileHeightCount = map.height;

        map.addTilesetImage('map', 'mapimage');
        let layer = map.createLayer('Ground');
        // layer.smoothed = false;

        layer.resizeWorld();

        this.world.game.scale.onSizeChange.add(function() {
            layer.resize(this.world.game.width, this.world.game.height);
        }, this);

        this.world.LAYER_BACKGROUND_0.add(layer);
    }
}