import { _decorator, AudioSource, Collider, Component, EventTouch, Input, input, ITriggerEvent, Node, systemEvent, SystemEvent } from 'cc';
import { Constant } from '../framework/Constant';
const { ccclass, property } = _decorator;

@ccclass('SelfPlane')
export class SelfPlane extends Component {

    @property(Node)
    public explode: Node = null;

    // 玩家飞机的血量上线
    public lifeValue = 5;

    // 当前血量
    private _currLife = 0;

    // 当前是否已经噶了
    public isDie = false;

    // 音频
    private _audioSource : AudioSource = null;

    // 获取血条表面节点
    @property(Node)
    public bloodFace: Node = null;

    // 血量的根节点
    @property(Node)
    public blood: Node = null;

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
            if(this._currLife === this.lifeValue) {
                this.blood.active = true;
            }
            this._currLife --;
            this.bloodFace.setScale(this._currLife/this.lifeValue,1,1)
            if(this._currLife <= 0) {
                this.isDie = true;
                this._audioSource.play();
                // 激活玩家飞机爆炸的粒子特效
                this.explode.active  = true;
                this.blood.active = false;
                console.log('self plane is die')
            }
        }
    }

    public init() {
        this._currLife = this.lifeValue;
        this.isDie = false;
        this.explode.active  = false;
        this.bloodFace.setScale(1,1,1)
    }

}
