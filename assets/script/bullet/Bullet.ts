import { _decorator, Collider, Component, ITriggerEvent, math, Node } from 'cc';
import { Constant } from '../framework/Constant';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    // 子弹的速度属性
    private _bulletSpeed = 0
    // 是不是敌机子弹
    private _isEnemyBullet = false
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
        const pos = this.node.position;
        let moveLength = 0;
        let outofRange = 50;
        if(this._isEnemyBullet) {
           moveLength = pos.z + this._bulletSpeed 
        }else{
            moveLength = pos.z - this._bulletSpeed
        }
        this.node.setPosition(pos.x, pos.y, moveLength)
        // 取绝对值
        moveLength = Math.abs(moveLength);
        // 超过边界,销毁子弹
        if(moveLength > outofRange) {
            this.node.destroy();
            console.log('销毁子弹');
        }
    }
    show(speed: number, isEnemyBullet: boolean) {
        this._bulletSpeed = speed;
        this._isEnemyBullet = isEnemyBullet;
    }
    private _onTriggerEnter(event: ITriggerEvent) {
        console.log('子弹碰撞事件')
        // 子弹直接销毁
        this.node.destroy();
    }
}

