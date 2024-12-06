import { _decorator, BoxCollider, Component, instantiate, Label, macro, math, Node, Prefab, Vec3, Animation } from 'cc';
import { Bullet } from '../bullet/Bullet';
import { Constant } from './Constant';
import { EnemyPlane } from '../plane/EnemyPlane';
import { BulletProp } from '../bullet/BulletProp';
import { SelfPlane } from '../plane/SelfPlane';
import { AudioManager } from './AudioManager';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    // 玩家飞机01
    @property(SelfPlane)
    public playerPlane: SelfPlane = null
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
    // 爆炸预制
    @property(Prefab)
    public enemyExplode: Prefab = null;

    // UI部分
    // 子弹
    @property(Prefab)
    public bullet01: Prefab = null
    @property(Prefab)
    public bullet02: Prefab = null
    @property(Prefab)
    public bullet03: Prefab = null
    @property(Prefab)
    public bullet04: Prefab = null
    @property(Prefab)
    public bullet05: Prefab = null

    // audio部分
    @property(AudioManager)
    public audioEffect :AudioManager = null;

    // 子弹的管理节点
    @property(Node)
    public bulletRoot: Node = null

    // 子弹移动的速度
    @property
    public bulletSpeed = 1

    // 子弹射击的周期
    @property    
    public shootTime = 0.3


    // 道具属性
    @property(Prefab)
    public bulletPropM: Prefab = null
    @property(Prefab)
    public bulletPropS: Prefab = null
    @property(Prefab)
    public bulletPropH: Prefab = null
    // 道具速度
    @property
    public bulletPropSpeed = 0.3;

    // 游戏结束界面
    @property(Node)
    public gameOverPage: Node = null;

    // 游戏界面
    @property(Node)
    public gamePage: Node = null;

    // 份数
    @property(Label)
    public gameScore: Label = null;

    // 游戏结束结算份数
    @property(Label)
    public gameOverScore: Label = null;

    // 代码控制动画播放
    @property(Animation)
    public overAnim: Animation = null;
    

    // 子弹射击时间
    private _currShootTime = 0
    
    // 是否触摸屏幕
    private _isShootIng = false

    // 创建当前敌机时间
    private _currrCreateEnemyTime = 0;

    // 组合的间隔状态
    private _combinationInterval = Constant.Combination.PLAN1;

    // 子弹类型
    private _bulletType = Constant.BulletPropType.BULLET_M;

    // 分数
    private _score = 0;

    // 游戏是否开始
    public isGameStart = false;
    start() {
        // 初始化
        this._init()
    }

    update(deltaTime: number) {

        // 前置条件：游戏是否开始了
        if(!this.isGameStart) {
            return;
        }

        // 判断当前玩家飞机是否死亡
        if(this.playerPlane.isDie) {
            this.gameOver();
            return;
        }

        this._currShootTime += deltaTime
        // 如果是触摸屏幕， 且射击时间大于周期，则可以再次发射子弹
        if(this._isShootIng && this._currShootTime > this.shootTime) {
            let createStr = 'createPlayerBulletM'
            switch (this._bulletType) {
                case Constant.BulletPropType.BULLET_H:
                    createStr = 'createPlayerBulletH'
                    break;
                case Constant.BulletPropType.BULLET_S:
                    createStr = 'createPlayerBulletS'
                    break;
                default:
                    createStr = 'createPlayerBulletM'
                    break;
            }
            const name = 'bullet' + (this._bulletType % 2 + 1)
            this.playAudioEffect(name)
            this[createStr]()
            this._currShootTime = 0
        }
        this._currrCreateEnemyTime += deltaTime;
        // if(this._currrCreateEnemyTime > this.createEnemyTime * 1.0) {
        //     this.createCombination2();
        //     this._currrCreateEnemyTime = 0;
        // }
        // return
        // 判断当前的敌机组合方式
        switch (this._combinationInterval) {
            case Constant.Combination.PLAN1:
                if(this._currrCreateEnemyTime > this.createEnemyTime) {
                    this.createEnemyPlane();
                    this._currrCreateEnemyTime = 0;
                }
                break;
            case Constant.Combination.PLAN2:
                if(this._currrCreateEnemyTime > this.createEnemyTime * 3) {
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
                if(this._currrCreateEnemyTime > this.createEnemyTime * 2) {
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
    private reData() {
        // 子弹射击时间
        this._currShootTime = 0

        // 是否触摸屏幕
        this._isShootIng = false

        // 创建当前敌机时间
        this._currrCreateEnemyTime = 0;

        // 组合的间隔状态
        this._combinationInterval = Constant.Combination.PLAN1;

        // 子弹类型
        this._bulletType = Constant.BulletPropType.BULLET_M;

        // 重置份数
        this._score = 0;

        // 初始化玩家位置
        this.playerPlane.node.setPosition(0, 0, 15)
    }
    public returnMain() {
        // 重置数据
        this.reData();
    }
    public gameStart() {
        console.log('gameStart--------');
        this.isGameStart = true
        // 再次开启定时器
        this._changePlaneMode();
        this._score = 0;
        this.gameScore.string = this._score.toString();
        this.playerPlane.init();
    }
    public gameRestart() {
        this.gameStart();
        this.reData();
    }

    public gameOver() {
        this.isGameStart = false;
        this.gamePage.active = false;
        this.gameOverPage.active = true;
        this.gameOverScore.string = this._score.toString();
        // 激活节点， 播放动画
        this.overAnim.play();
        // 取消射击状态
        this.isShootIngs(false);
        // 取消定时器的状态
        this.unschedule(this._modeChanged);
        // 销毁场景里面的所有对象
        this._destoryAll();
    }

    // 获取分数
    public addScore() {
        console.log('加分')
        this._score ++;
        this.gameScore.string = this._score.toString();
    }

    // 创建玩家子弹
    public createPlayerBulletM() {
        // 创建玩家子弹， 预制资源调用instantiate接口获取node节点
        const bullet = PoolManager.instance().getNode(this.bullet01, this.bulletRoot);
        // const bullet = instantiate(this.bullet01)
        // 将所有的子弹添加子弹管理节点中
        // bullet.setParent(this.bulletRoot)
        // 设置子弹的位置
        const pos = this.playerPlane.node.position;
        bullet.setPosition(pos.x, pos.y, pos.z - 7);
        // 设置子弹的移动速度
        const bulletCom = bullet.getComponent(Bullet)
        bulletCom.show(this.bulletSpeed, false)
    }
    public createPlayerBulletH() {
        // 获取子弹的位置
        const pos = this.playerPlane.node.position;
        // 左右 两边
        const ary = [-2.5, 2.5];
        ary.forEach((item, index) => {
            // 创建玩家子弹， 预制资源调用instantiate接口获取node节点
            const bullet1 = PoolManager.instance().getNode(this.bullet03, this.bulletRoot);
            // const bullet1 = instantiate(this.bullet03)
            // 将所有的子弹添加子弹管理节点中
            // bullet1.setParent(this.bulletRoot)
            bullet1.setPosition(pos.x + item, pos.y, pos.z - 7);
            // 设置子弹的移动速度
            const bulletCom1 = bullet1.getComponent(Bullet)
            bulletCom1.show(this.bulletSpeed, false)
        })
    }
    public createPlayerBulletS() {
        // 设置子弹的位置
        const pos = this.playerPlane.node.position;
        // 三发子弹 
        const ary  = [-4, 0, 4];
        ary.forEach((item, index) => {
            const type = item == 0 ? Constant.Direction.MIDDLE : item == -4 ? Constant.Direction.LEFT : Constant.Direction.RIGHT
            // 创建玩家子弹， 预制资源调用instantiate接口获取node节点
            const bullet = PoolManager.instance().getNode(this.bullet05, this.bulletRoot);
            // const bullet = instantiate(this.bullet05)
            // 将所有的子弹添加子弹管理节点中
            // bullet.setParent(this.bulletRoot)
            bullet.setPosition(pos.x + item, pos.y, pos.z - 7);
            // 设置子弹的移动速度
            const bulletCom = bullet.getComponent(Bullet)
            bulletCom.show(this.bulletSpeed, false, type)  
        })
    }
    public createEnemuyBullet(targetPos: Vec3) {
        // 创建敌人子弹
        const bullet = PoolManager.instance().getNode(this.bullet02, this.bulletRoot);
        // const bullet = instantiate(this.bullet01);
        // bullet.setParent(this.bulletRoot);
        // 设置子弹的位置
        bullet.setPosition(targetPos.x, targetPos.y, targetPos.z + 5);
        // 设置子弹的移动速度
        const bulletCom = bullet.getComponent(Bullet)
        bulletCom.show(1, true)

        // 给敌机子弹添加眼码
        const colliderComp = bullet.getComponent(BoxCollider);
        colliderComp.setGroup(Constant.CollisionType.ENEMY_BULLET);
        colliderComp.setMask(Constant.CollisionType.SELF_PLANE);
    }

    // 敌机死亡的时候调用粒子特效
    public createEnemyEffect(pos: Vec3) {
        const effect = PoolManager.instance().getNode(this.enemyExplode, this.bulletRoot);
        effect.setPosition(pos);
    }

    public createBulletProp() {
        // 创建子弹道具
        const randomProp = math.randomRangeInt(1, 4);
        let prefab: Prefab = null;
        switch (randomProp) {
            case Constant.BulletPropType.BULLET_H:
                prefab = this.bulletPropH;
                break;
            case Constant.BulletPropType.BULLET_S:
                prefab = this.bulletPropS;
                break;
            default:
                prefab = this.bulletPropM;
                break;
        }
        // 实例化道具
        const prop = PoolManager.instance().getNode(prefab, this.node);
        // const prop = instantiate(prefab);
        // prop.setParent(this.node);
        prop.setPosition(15, 0, -50);
        // 展示道具
        const propComp = prop.getComponent(BulletProp)
        propComp.show(this, -this.bulletPropSpeed)
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
        const enemy = PoolManager.instance().getNode(prefab, this.node);
        // const enemy = instantiate(prefab);
        // enemy.setParent(this.node);
        const enemyComp = enemy.getComponent(EnemyPlane);
        enemyComp.show(this, speed, true);

        // 随机生成敌机的区间是-25 25
        const randomPos = math.randomRangeInt(-20, 21);
        enemy.setPosition(randomPos, 0, -50);
    }
    public createCombination1() {
        const enmyArray = new Array<Node>(5);
        Array.from(enmyArray).forEach((item, index) => {
            enmyArray[index] = PoolManager.instance().getNode(this.enemy01, this.node);
            // enmyArray[index] = instantiate(this.enemy01);
            const element = enmyArray[index];
            // element.parent = this.node;
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
            enmyArray[index] = PoolManager.instance().getNode(this.enemy02, this.node);
            // enmyArray[index] = instantiate(this.enemy02);
            const element = enmyArray[index];
            // element.parent = this.node;
            element.setPosition(combinationPos[index][0], combinationPos[index][1], combinationPos[index][2]);
            const enemyComp = element.getComponent(EnemyPlane)
            enemyComp.show(this, this.enemy2Speed, false);
        })
    }
    // 初始化
    private _init() {
        this._currShootTime = this.shootTime;
        // 初始化飞机
        this.playerPlane.init();

        // 定时器不在此处开始, 在游戏开始的方法中开启定时器
        // this._changePlaneMode();

        // 测试代码 初始化的时候就创建子弹道具
        // this.createBulletProp();
    }

    // 更改当前子弹的leix
    public changeBulletType(type: number) {
        this._bulletType = type
    }

    // 设置音频
    public playAudioEffect(name: string) {
        this.audioEffect.play(name);
    }

    // 设定一个定时器
    private _changePlaneMode(){
        // 如果要定时器一直执行下去，则需要 macro.REPEAT_FOREVER]
        this.schedule(this._modeChanged, 10, macro.REPEAT_FOREVER);
    }
    private _modeChanged(){
        this._combinationInterval ++
        // 创建子弹道具
        this.createBulletProp();
    }
    private _destoryAll() {
        // 销毁场景里面的所有gamemanager子节点对象
        let children = this.node.children;
        let length = children.length;
        // 销毁对象必须从最后一个开始销毁， 如果从前往后的话
        // 第一个被销毁了，那么后一个就会补上第一个的位置，就会产生问题
        for (let i = length - 1; i >= 0; i-- ) {
            const element = children[i]
            // 将对象放回节电池, 不需要销毁了
            PoolManager.instance().putNode(element)
            // element.destroy();
        }

        // 销毁所有的子弹节点
        children = this.bulletRoot.children;
        length = children.length;
        for(let i = length -1; i >= 0; i--) {
            const element = children[i]
            // 将对象放回节电池, 不需要销毁了
            PoolManager.instance().putNode(element)
            // element.destroy();
        }
    }
}

