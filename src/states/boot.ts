/**
 * State to initialize Phaser Engine,
 * After that, move to Preloader state
 */
export default class Boot extends Phaser.State {
    private nextState: string = 'preloader';

    public preload(): void {
        // Disable context menu on page
        this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };
    }

    public create(): void {
        // Disable multi touch
        this.input.maxPointers = 1;

        // Setup scale mode and page align

        this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        if (this.game.device.desktop) {
            // Any desktop specific stuff here

        } else {
            // Any mobile specific stuff here

            // Force landscape
            this.game.scale.forceOrientation(true, false);
        }

        if (this.game.scale.scaleMode === Phaser.ScaleManager.RESIZE) {
            this.game.scale.parentIsWindow = true;
            window.addEventListener('resize', function () {
                this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
                this.game.scale.refresh();
            }.bind(this));
            this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
        } else if (this.game.scale.scaleMode === Phaser.ScaleManager.USER_SCALE) {
            window.addEventListener('resize', function () {
                this.onResizeUserScale();
            }.bind(this));
            this.onResizeUserScale();
        }

        this.game.stage.disableVisibilityChange = true;
        // Run next state
        this.game.state.start(this.nextState);
    }

    private onResizeUserScale() {
        let hScale = window.innerWidth / DEFAULT_GAME_WIDTH ;
        let vScale = window.innerHeight / DEFAULT_GAME_HEIGHT;

        let scale = Math.max(hScale, vScale);

        this.game.scale.setGameSize(DEFAULT_GAME_WIDTH, DEFAULT_GAME_HEIGHT);

        this.game.scale.setUserScale(scale, scale, 0, 0);
        let realWidth = window.innerWidth;
        let offsetWidth = Math.abs(realWidth - DEFAULT_GAME_WIDTH * scale) / 2;
        let realHeight = window.innerHeight;
        let offsetHeight = Math.abs(realHeight - DEFAULT_GAME_HEIGHT * scale) / 2;
        this.game['screenOffsetWidth'] = offsetWidth;
        this.game['screenOffsetHeight'] = offsetHeight;
        this.game.canvas.parentElement.style.left = (-offsetWidth).toString() + "px";
        this.game.canvas.parentElement.style.top = (-offsetHeight).toString() + "px";
        this.game.canvas.parentElement.style.position = "absolute";
        this.game.canvas.parentElement.style.zIndex = "-1";
    }
}
