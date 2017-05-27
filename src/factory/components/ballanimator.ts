import AnimatorComponent from "./animator";
import NetworkTransformComponent from "./networktransform";

export default class BallAnimatorComponent extends AnimatorComponent {

    constructor() {
        super();
    }

    public start() {
        super.start();
    }

    public update(dt: number) {
        super.update(dt);
        if (this.cachedTransform.isMoving()) {
            this.cachedTransform.rotation += 0.01;
        } else {
            this.cachedSpriteComponent.sprite.animations.stop();
        }
    }

    public destroy() {
    }
}