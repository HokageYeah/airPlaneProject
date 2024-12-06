import { _decorator, Collider, Component, ITriggerEvent, Node } from 'cc';
import { Constant } from '../framework/Constant';
import { GameManager } from '../framework/GameManager';
import { PoolManager } from '../framework/PoolManager';
const { ccclass, property } = _decorator;

const OUTOFBOUNCE = 55;

@ccclass('EnemyPlane')
export class EnemyPlane extends Component {

    // 子弹发射周期
    @property
    public  createBulletTime = 0.5;

    // 当前子弹发射时间
    private _currCreateBulletTime = 0;

    // 当前是否要发射子弹
    private _needBullet = false;

    // 速度
    private _enemySpeed = 0;

    // 获取gameManager
    private _gameManager: GameManager = null;

    // 配置敌机类型
    // public enemyType = Constant.EnemyType.TYPE1;
    start() {

    }

    // 激活的时候监听
    onEnable() {
        // 获取碰撞组件
        const collider = this.getComponent(Collider);
        // 监听触发事件
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
        // 监听碰撞事件
        collider.on('onCollisionEnter', this._onCollisionEnter, this);
    }
    // 失活的时候取消监听
    onDisable() {
        const collider = this.getComponent(Collider);
        // 取消监听
        collider.off('onTriggerEnter', this._onTriggerEnter, this);
    }

    update(deltaTime: number) {
        const pos = this.node.position;
        const movePos = pos.z + this._enemySpeed
        // 向下飞所以应该是正
        this.node.setPosition(pos.x, pos.y, movePos)
        // 如果需要发射子弹则根据周期执行发射子弹逻辑
        if(this._needBullet) {
            this._currCreateBulletTime += deltaTime;
            if(this._currCreateBulletTime > this.createBulletTime) {
                this._currCreateBulletTime = 0
                // 发射子弹, 需要知道当前敌机的位置，传递位置参数
                this._gameManager.createEnemuyBullet(this.node.position);
            }
        }
        // 超出边界，所以需要销毁
        if(movePos > OUTOFBOUNCE) {
            // 将对象放回节电池, 不需要销毁了
            PoolManager.instance().putNode(this.node)
            // this.node.destroy();
        }
    }

    show( gameManager: GameManager, speed: number, needBullet: boolean) {
        // console.log('敌方飞机显示---', gameManager);
        this._gameManager = gameManager
        this._enemySpeed = speed;
        this._needBullet = needBullet
    }
    private _onTriggerEnter(event: ITriggerEvent) {
        console.log('敌方触发事件')
        // 获取碰撞到的分组
        const collisionGroup = event.otherCollider.getGroup(); 
        // 如果敌方的飞机碰撞玩家飞机、或者玩家子弹的话，执行如下逻辑
        if(collisionGroup === Constant.CollisionType.SELF_PLANE || collisionGroup === Constant.CollisionType.SELF_BULLET) {
            // console.log('敌方要销毁---', this._gameManager);
            this._gameManager.playAudioEffect('enemy');
            // 加分
            this._gameManager.addScore();
            // 将对象放回节电池, 不需要销毁了
            PoolManager.instance().putNode(this.node)
            this._gameManager.createEnemyEffect(this.node.position);
            // this.node.destroy();
        }
    }
    private _onCollisionEnter(event: ITriggerEvent) {
        console.log('敌方子弹碰撞事件')
    }
}


