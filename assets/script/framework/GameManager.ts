import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { Bullet } from '../bullet/Bullet';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    public playerPlane: Node = null
    @property(Prefab)
    public bullet01: Node = null
    @property(Prefab)
    public bullet02: Node = null
    @property(Prefab)
    public bullet03: Node = null
    @property(Prefab)
    public bullet04: Node = null
    @property(Prefab)
    public bullet05: Node = null

    // 子弹的管理节点
    @property(Node)
    public bulletRoot: Node = null

    // 子弹移动的速度
    @property
    public bulletSpeed = 1

    // 子弹射击的周期
    @property    
    public shootTime = 0.3

    // 子弹射击时间
    private _currShootTime = 0
    
    // 是否触摸屏幕
    private _isShootIng = false
    start() {
        // 初始化
        this._init()
    }

    update(deltaTime: number) {
        this._currShootTime += deltaTime
        // 如果是触摸屏幕， 且射击时间大于周期，则可以再次发射子弹
        if(this._isShootIng && this._currShootTime > this.shootTime) {
            this._createPlayerBullet()
            this._currShootTime = 0
        }
    }
    // 创建玩家子弹
    private _createPlayerBullet() {
        // 创建玩家子弹， 预制资源调用instantiate接口获取node节点
        const bullet = instantiate(this.bullet01)
        // 将所有的子弹添加子弹管理节点中
        bullet.setParent(this.bulletRoot)
        // 设置子弹的位置
        const pos = this.playerPlane.position;
        bullet.setPosition(pos.x, pos.y, pos.z - 7);
        // 设置子弹的移动速度
        const bulletCom = bullet.getComponent(Bullet)
        bulletCom.bulletSpeed = this.bulletSpeed
    }
    // 判断当前是否处于触摸状态
    public isShootIngs(value: boolean) {
        this._isShootIng = value
    }

    // 初始化
    private _init() {
        this._currShootTime = this.shootTime;
    }
}

