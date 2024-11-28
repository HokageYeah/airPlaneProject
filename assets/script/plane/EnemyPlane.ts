import { _decorator, Component, Node } from 'cc';
import { Constant } from '../framework/Constant';
import { GameManager } from '../framework/GameManager';
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
            this.node.destroy();
        }
    }

    show( gameManager: GameManager, speed: number, needBullet: boolean) {
        this._gameManager = gameManager
        this._enemySpeed = speed;
        this._needBullet = needBullet
    }
}


