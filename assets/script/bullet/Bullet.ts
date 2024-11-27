import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

const OUTOFRANGE = 50;
@ccclass('Bullet')
export class Bullet extends Component {
    // 子弹的速度属性
    @property
    public bulletSpeed = 0
    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.position;
        const moveLength = pos.z - this.bulletSpeed;
        this.node.setPosition(pos.x, pos.y, moveLength)
        // 超过边界,销毁子弹
        if(moveLength > OUTOFRANGE) {
            this.node.destroy();
            console.log('销毁子弹');
        }
    }
}

