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

    // 游戏开始
    @property(Node)
    public gameStart :Node = null;

    @property(Node)
    public game :Node = null;

    @property(Node)
    public gameOver :Node = null;

    start() {
        // input.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
        this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
        this.node.on(Input.EventType.TOUCH_END, this._touchEnd, this)
        this.node.on(Input.EventType.TOUCH_START, this._touchStart, this)

        // 初始化的时候要让gamestart显示
        this.gameStart.active = true;
    }

    update(deltaTime: number) {
        
    }
    public reStart() {
        console.log('uimain----restart')
        this.gameOver.active = false;
        this.game.active = true;
        this.gameManager.playAudioEffect('button')
        this.gameManager.gameRestart();
    }

    public returnMain() {
        this.gameOver.active = false;
        this.gameStart.active = true;
        this.gameManager.playAudioEffect('button')
        this.gameManager.returnMain();
    }

    _touchMove( event: EventTouch) {
        if(!this.gameManager.isGameStart) {
            return;
        }
        const delta =  event.touch.getDelta();
        // console.log('_touchMove----', event)
        // console.log('_touchMove----delta---', delta)
        let pos = this.playerPlane.position;
        this.playerPlane.setPosition(pos.x + 0.01 * this.planeSpeed * delta.x, pos.y, pos.z - 0.01 * this.planeSpeed * delta.y)
    }

    _touchStart( event: EventTouch) {
        // console.log('_touchStart----', event)
        // console.log('_touchStart----gameManager---', this.gameManager)
        if(this.gameManager.isGameStart) {
            this.gameManager.isShootIngs(true)
        }else{
            this.gameStart.active = false
            this.game.active = true;
            this.gameManager.playAudioEffect('button')
            this.gameManager.gameStart();
        }
    }

    _touchEnd( event: EventTouch) {
        // console.log('_touchEnd----', event)
        if(!this.gameManager.isGameStart) {
            return;
        }
        this.gameManager.isShootIngs(false)
    }
}

