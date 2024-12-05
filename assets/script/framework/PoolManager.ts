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
    private static _instance: PoolManager;

    // 实例化方法
    public static instance() {
        if(!this._instance) {
            this._instance = new PoolManager();
        }
        return this._instance;
    }

    // 获取容器节点
    public getNode(prefab: Prefab, parent: Node) {
        let name = prefab.name;
        // console.log('get node  ' + name);
        let node : Node = null;
        this._dictPrefab[name] = prefab;
        const pool = this._dictPool[name];
        if(pool) {
            if(pool.size() > 0) {
                node = pool.get()
            }else{
                node = instantiate(prefab)
            }
        }else{
            this._dictPool[name] = new NodePool()
            node = instantiate(prefab);
        }
        // 设置节点归属
        node.parent = parent;
        // 激活
        node.active = true;
        return node
    }

    /**
     * putNode 存放容器节点
     */
    public putNode(node: Node) {
        // 获取节点名字
        let name  = node.name
        // console.log('put node  ' + name);
        // 节点已经被回收了，所以应该隐藏节点
        node.parent = null;
        // 判断容器中是否有该节点
        if(!this._dictPool[name]) {
            this._dictPool[name] = new NodePool()
        }
        // 存放节点
        this._dictPool[name].put(node)
    }
}


