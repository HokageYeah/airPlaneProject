import { _decorator, BoxCollider, Collider, Component, ICollisionEvent, ITriggerEvent, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    start() {
        const collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this);
        collider.on('onTriggerExit', this._onTriggerExit, this);
        collider.on('onTriggerStay', this._onTriggerStay, this);
        collider.on('onCollisionEnter', this._onCollisionEnter, this);
        collider.on('onCollisionExit', this._onCollisionExit, this);
        collider.on('onCollisionStay', this._onCollisionStay, this);
    }

    update(deltaTime: number) {
        
    }
    private _onTriggerEnter(event: ITriggerEvent) {
        console.log(`触发器-trigger---${this.node.name}    target  ${event.otherCollider.node.name}   type: ${event.type}`);
    }
    private _onTriggerExit(event: ITriggerEvent) {
        console.log(`触发器-trigger---${this.node.name}    target  ${event.otherCollider.node.name}   type: ${event.type}`);
    }
    private _onTriggerStay(event: ITriggerEvent) {
        console.log(`触发器-trigger---${this.node.name}    target  ${event.otherCollider.node.name}   type: ${event.type}`);
    }
    private _onCollisionEnter(event: ICollisionEvent) {
        console.log(`碰撞器-Collision---${this.node.name}    target  ${event.otherCollider.node.name}   type: ${event.type}`);
    }
    private _onCollisionExit(event: ICollisionEvent) {
        console.log(`碰撞器-Collision---${this.node.name}    target  ${event.otherCollider.node.name}   type: ${event.type}`);
    }
    private _onCollisionStay(event: ICollisionEvent) {
        console.log(`碰撞器-Collision---${this.node.name}    target  ${event.otherCollider.node.name}   type: ${event.type}`);
    }
}

