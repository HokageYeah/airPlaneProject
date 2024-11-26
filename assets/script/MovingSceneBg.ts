import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MovingSceneBg')
export class MovingSceneBg extends Component {

    @property(Node)
    bg01: Node = null;
    
    @property(Node)
    bg02: Node = null;

    private _bgSpeed = 10;
    private _bgMovingRange = 90;

    start() {
        this.bg01.setPosition(0, 0, 0)
        this.bg02.setPosition(0, 0, -this._bgMovingRange)
    }
    private _init() {

    }
    update(deltaTime: number) {
        this._moveBackground(deltaTime)
    }
    private _moveBackground(deltaTime: number) {
        this.bg01.setPosition(0, 0, this.bg01.position.z + this._bgSpeed * deltaTime)
        this.bg02.setPosition(0, 0, this.bg02.position.z + this._bgSpeed * deltaTime)
        if(this.bg01.position.z > this._bgMovingRange) {
            this.bg01.setPosition(0, 0, this.bg02.position.z - this._bgMovingRange);
        }else if (this.bg02.position.z > this._bgMovingRange) {
            this.bg02.setPosition(0, 0, this.bg01.position.z - this._bgMovingRange);
        }
    }
}


