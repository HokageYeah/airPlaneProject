import { _decorator, Component, instantiate, math, Node, Prefab, Vec3 } from 'cc';
import { Bullet } from '../bullet/Bullet';
import { Constant } from './Constant';
import { EnemyPlane } from '../plane/EnemyPlane';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    // 玩家飞机01
    @property(Node)
    public playerPlane: Node = null
    // 敌机enemy
    @property(Prefab)
    public enemy01: Prefab = null
    @property(Prefab)
    public enemy02: Prefab = null
    @property
    public createEnemyTime = 1; // 创建敌机时间
    @property
    public enemy1Speed = 0.5; // 敌机1速度
    @property
    public enemy2Speed = 0.7; // 敌机2速度

    // 子弹
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

    // 创建当前敌机时间
    private _currrCreateEnemyTime = 0;

    // 组合的间隔状态
    private _combinationInterval = Constant.Combination.PLAN1;
    start() {
        // 初始化
        this._init()
    }

    update(deltaTime: number) {
        this._currShootTime += deltaTime
        // 如果是触摸屏幕， 且射击时间大于周期，则可以再次发射子弹
        if(this._isShootIng && this._currShootTime > this.shootTime) {
            this.createPlayerBullet()
            this._currShootTime = 0
        }
        this._currrCreateEnemyTime += deltaTime;
        // 判断当前的敌机组合方式
        switch (this._combinationInterval) {
            case Constant.Combination.PLAN1:
                if(this._currrCreateEnemyTime > this.createEnemyTime) {
                    this.createEnemyPlane();
                    this._currrCreateEnemyTime = 0;
                }
                break;
            case Constant.Combination.PLAN2:
                if(this._currrCreateEnemyTime > this.createEnemyTime * 0.9) {
                    const  randomCombination = math.randomRangeInt(1, 3);
                    if(randomCombination === Constant.Combination.PLAN2) {
                        this.createCombination1();
                    }else{
                        this.createEnemyPlane();
                    }
                    this._currrCreateEnemyTime = 0;
                }
                break;
            default:
                if(this._currrCreateEnemyTime > this.createEnemyTime * 0.8) {
                    const  randomCombination = math.randomRangeInt(1, 4);
                    if(randomCombination === Constant.Combination.PLAN2) {
                        this.createCombination1();
                    } else if(randomCombination === Constant.Combination.PLAN3) {
                        this.createCombination2();
                    } else{
                        this.createEnemyPlane();
                    }
                    this._currrCreateEnemyTime = 0;
                }
                break;
        }
    }
    // 创建玩家子弹
    public createPlayerBullet() {
        // 创建玩家子弹， 预制资源调用instantiate接口获取node节点
        const bullet = instantiate(this.bullet01)
        // 将所有的子弹添加子弹管理节点中
        bullet.setParent(this.bulletRoot)
        // 设置子弹的位置
        const pos = this.playerPlane.position;
        bullet.setPosition(pos.x, pos.y, pos.z - 7);
        // 设置子弹的移动速度
        const bulletCom = bullet.getComponent(Bullet)
        bulletCom.show(this.bulletSpeed, false)
    }
    public createEnemuyBullet(targetPos: Vec3) {
        // 实例子弹
        const bullet = instantiate(this.bullet01);
        bullet.setParent(this.bulletRoot);
        // 设置子弹的位置
        bullet.setPosition(targetPos.x, targetPos.y, targetPos.z + 5);
        // 设置子弹的移动速度
        const bulletCom = bullet.getComponent(Bullet)
        bulletCom.show(1, true)
    }
    // 判断当前是否处于触摸状态
    public isShootIngs(value: boolean) {
        this._isShootIng = value
    }

    // 创建单一的飞机
    public createEnemyPlane() {
        const whichEnemy = math.randomRangeInt(1, 3);
        let prefab: Prefab = null;
        let speed = 0;
        if(whichEnemy === Constant.EnemyType.TYPE1){
            prefab = this.enemy01;
            speed = this.enemy1Speed;
        }else{
            prefab = this.enemy02;
            speed = this.enemy2Speed;
        }
        const enemy = instantiate(prefab);
        enemy.setParent(this.node);
        const enemyComp = enemy.getComponent(EnemyPlane);
        enemyComp.show(this, speed, true);

        // 随机生成敌机的区间是-25 25
        const randomPos = math.randomRangeInt(-20, 21);
        enemy.setPosition(randomPos, 0, -50);
    }
    public createCombination1() {
        const enmyArray = new Array<Node>(5);
        Array.from(enmyArray).forEach((item, index) => {
            enmyArray[index] = instantiate(this.enemy01);
            const element = enmyArray[index];
            element.parent = this.node;
            element.setPosition(-20 + index * 10, 0, -50);
            const enemyComp = element.getComponent(EnemyPlane)
            enemyComp.show(this, this.enemy1Speed, false);
        })
    }
    public createCombination2() {
        const enmyArray = new Array<Node>(7);
        // 定义位置数组
        const combinationPos = [
            [-20, 0, -60,],
            [-14, 0, -55,],
            [-7,0, -50,],
            [0,0,-45,],
            [7,0,-50,],
            [14,0,-55,],
            [21,0,-60]
        ];
        // 创建v字型的飞机
        Array.from(enmyArray).forEach((item, index) => {
            enmyArray[index] = instantiate(this.enemy02);
            const element = enmyArray[index];
            element.parent = this.node;
            element.setPosition(combinationPos[index][0], combinationPos[index][1], combinationPos[index][2]);
            const enemyComp = element.getComponent(EnemyPlane)
            enemyComp.show(this, this.enemy2Speed, false);
        })
    }
    // 初始化
    private _init() {
        this._currShootTime = this.shootTime;
        this._changePlaneMode();
    }

    // 设定一个定时器
    private _changePlaneMode(){
        this.schedule(this._modeChanged, 10, 3);
    }
    private _modeChanged(){
        this._combinationInterval ++
    }
}

