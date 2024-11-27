import { _decorator, Component, EventTouch, Input, input, Node, systemEvent, SystemEvent } from 'cc';
import { GameManager } from '../framework/GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends Component {
    @property
    public planeSpeed = 1;

    @property(Node)
    public playerPlane: Node = null;

    @property(GameManager)
    public gameManager :GameManager = null;
    start() {
        // input.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
        this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
        this.node.on(Input.EventType.TOUCH_END, this._touchEnd, this)
        this.node.on(Input.EventType.TOUCH_START, this._touchStart, this)
    }

    update(deltaTime: number) {
        
    }
    _touchMove( event: EventTouch) {
        const delta =  event.touch.getDelta();
        console.log('_touchMove----', event)
        console.log('_touchMove----delta---', delta)
        let pos = this.playerPlane.position;
        this.playerPlane.setPosition(pos.x + 0.01 * this.planeSpeed * delta.x, pos.y, pos.z - 0.01 * this.planeSpeed * delta.y)
    }

    _touchStart( event: EventTouch) {
        console.log('_touchStart----', event)
        console.log('_touchStart----gameManager---', this.gameManager)
        this.gameManager.isShootIngs(true)
    }

    _touchEnd( event: EventTouch) {
        console.log('_touchEnd----', event)
        this.gameManager.isShootIngs(false)
    }
}

