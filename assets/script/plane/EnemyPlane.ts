import { _decorator, Component, Node } from 'cc';
import { Constant } from '../framework/Constant';
const { ccclass, property } = _decorator;

const OUTOFBOUNCE = 55;

@ccclass('EnemyPlane')
export class EnemyPlane extends Component {
    // 速度
    private _enemySpeed = 0;

    // 配置敌机类型
    // public enemyType = Constant.EnemyType.TYPE1;
    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.position;
        const movePos = pos.z + this._enemySpeed
        // 向下飞所以应该是正
        this.node.setPosition(pos.x, pos.y, movePos)
        // 超出边界，所以需要销毁
        if(movePos > OUTOFBOUNCE) {
            this.node.destroy();
        }
    }

    show(speed: number) {
        this._enemySpeed = speed;
    }
}


