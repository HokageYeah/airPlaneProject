import { _decorator, Component, EventTouch, Input, input, Node, systemEvent, SystemEvent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SelfPlane')
export class SelfPlane extends Component {

    @property
    public speed = 1;

    start() {
        input.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
    }

    update(deltaTime: number) {
        
    }

    _touchMove( event: EventTouch) {
        const delta =  event.touch.getDelta();
        console.log('_touchMove----', event)
        console.log('_touchMove----delta---', delta)
        let pos = this.node.position;
        this.node.setPosition(pos.x + 0.01 * this.speed * delta.x, pos.y, pos.z - 0.01 * this.speed * delta.y)
    }
}


