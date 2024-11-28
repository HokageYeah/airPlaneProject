import { _decorator, Collider, Component, EventTouch, Input, input, ITriggerEvent, Node, systemEvent, SystemEvent } from 'cc';
import { Constant } from '../framework/Constant';
const { ccclass, property } = _decorator;

@ccclass('SelfPlane')
export class SelfPlane extends Component {
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
        
    }
    private _onTriggerEnter(event: ITriggerEvent) {
        console.log('玩家碰撞事件')
        // 获取碰撞到的分组
        const collisionGroup = event.otherCollider.getGroup(); 
        // 如果玩家的飞机碰撞敌方飞机、或者敌方子弹的话，执行如下逻辑
        if(collisionGroup === Constant.CollisionType.ENEMY_PLANE || collisionGroup === Constant.CollisionType.ENEMY_BULLET) {
            console.log('reduce blood')
        }
    }

}
