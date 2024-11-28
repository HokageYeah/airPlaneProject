import { _decorator, Component, math, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    // 子弹的速度属性
    private _bulletSpeed = 0
    // 是不是敌机子弹
    private _isEnemyBullet = false
    start() {

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
}

