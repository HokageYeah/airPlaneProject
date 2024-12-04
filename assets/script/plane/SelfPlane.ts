import { _decorator, AudioSource, Collider, Component, EventTouch, Input, input, ITriggerEvent, Node, systemEvent, SystemEvent } from 'cc';
import { Constant } from '../framework/Constant';
const { ccclass, property } = _decorator;

@ccclass('SelfPlane')
export class SelfPlane extends Component {

    // 玩家飞机的血量上线
    public lifeValue = 5;

    // 当前血量
    private _currLife = 0;

    // 当前是否已经噶了
    public isDie = false;

    // 音频
    private _audioSource : AudioSource = null;

    start() {
        this._audioSource = this.getComponent(AudioSource);
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
            this._currLife --;
            if(this._currLife <= 0) {
                this.isDie = true;
                this._audioSource.play();
                console.log('self plane is die')
            }
        }
    }

    public init() {
        this._currLife = this.lifeValue;
        this.isDie = false;
    }

}
