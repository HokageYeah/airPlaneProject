import { _decorator, Component, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass, property } = _decorator;

interface IDictPool {
    [name: string]: NodePool 
}

interface IDictPrefab {
    [name: string]: Prefab
}

@ccclass('PoolManager')
export class PoolManager{

    // 定义容器对象
    // 存放节点\预制
    private _dictPool: IDictPool = {};
    private _dictPrefab: IDictPrefab = {};

    // 获取容器节点
    public getNode(prefab: Prefab, parent: Node) {

    }

    /**
     * putNode 存放容器节点
     */
    public putNode() {
        
    }
}


