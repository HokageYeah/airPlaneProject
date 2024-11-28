import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export class Constant {
    // 敌机类型
    public static EnemyType = {
        TYPE1: 1,
        TYPE2: 2,
    }
    // 组合类型
    public static Combination = {
        PLAN1: 1,
        PLAN2: 2,
        PLAN3: 3,
    }

    // 碰撞类型 ，顺序要对应在碰撞矩阵那边设置的顺序，且值得为二进制的
    public static CollisionType = {
        SELF_PLANE: 1 << 1,
        ENEMY_PLANE: 1 << 2,
        SELF_BULLET: 1 << 3,
        ENEMY_BULLET: 1 << 4,
    }
}


