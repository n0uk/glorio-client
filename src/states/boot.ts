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

        this.game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        if (this.game.device.desktop) {
            // Any desktop specific stuff here

        } else {
            // Any mobile specific stuff here

            // Force landscape
            this.game.scale.forceOrientation(true, false);
        }

        this.game.scale.parentIsWindow = true;

        // Add auto-resize handler
        let self = this;
        window.addEventListener('resize', function () {  
            self.game.scale.setGameSize(window.innerWidth, window.innerHeight);
            self.game.scale.refresh();
        });
        self.game.scale.setGameSize(window.innerWidth, window.innerHeight);

        this.game.stage.disableVisibilityChange = true;

        // Run next state
        this.game.state.start(this.nextState);
    }
}
