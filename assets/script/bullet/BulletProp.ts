import { _decorator, Collider, Component, ITriggerEvent, Node } from 'cc';
import { GameManager } from '../framework/GameManager';
import { Constant } from '../framework/Constant';
import { PoolManager } from '../framework/PoolManager';
const { ccclass, property } = _decorator;

@ccclass('BulletProp')
export class BulletProp extends Component {
    // 移动的速度
    private _propSpeed = 0.3
    private _propXSpeed = 0.3
    // 游戏管理类
    private _gameManager: GameManager = null
    start() {

    }

    // 激活的时候监听
    onEnable() {
        // 获取碰撞组件
        const collider = this.getComponent(Collider);
        // 监听碰撞事件
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
    }
    // 失活的时候取消监听
    onDisable() {
        const collider = this.getComponent(Collider);
        // 取消监听
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    update(deltaTime: number) {
        let pos = this.node.position;
        if(pos.x >= 15) {
            this._propXSpeed = this._propSpeed;
        } else if (pos.x <= -15) {
            this._propXSpeed = -this._propSpeed;
        }
        this.node.setPosition(pos.x + this._propXSpeed, pos.y, pos.z - this._propSpeed);
        pos = this.node.position;
        // 超出50就销毁
        if(pos.z > 50) {
            // this.node.destroy();
            // 将对象放回节电池, 不需要销毁了
            PoolManager.instance().putNode(this.node)
        }
    }
    show(gameManager: GameManager ,speed: number) {
        this._gameManager = gameManager
        this._propSpeed = speed;
    }
    private _onTriggerEnter(event: ITriggerEvent) {
        console.log('道具碰到了')
        const name = event.selfCollider.node.name;
        switch (name) {
            case 'bulletH':
                this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_H);
                break;
            case 'bulletS':
                this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_S);
                break;
            default:
                this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_M);
                break;
        }
        // this.node.destroy();
        // 将对象放回节电池, 不需要销毁了
        PoolManager.instance().putNode(this.node)
    }
}

