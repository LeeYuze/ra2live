class GameApi {

    static GameApiEnum = {
        PlayerType: {
            Player: 0,
            Ai: 1
        },
        ObjectType: {
            None: 0, // 无
            Aircraft: 1, // 飞行器
            Building: 2, // 建筑物
            Infantry: 3, // 步兵
            Overlay: 4, // 覆盖物
            Smudge: 5, // 污点
            Terrain: 6, // 地形
            Vehicle: 7, // 车辆
            Animation: 8, // 动画
            Projectile: 9, // 弹丸
            VoxelAnim: 10, // 体素动画
            Debris: 11 // 碎片
        },
        OrderType: {
            Move: 0,
            ForceMove: 1,
            Attack: 2,
            ForceAttack: 3,
            AttackMove: 4,
            Guard: 5,
            GuardArea: 6,
            Capture: 7,
            Occupy: 8,
            Deploy: 9,
            DeploySelected: 10,
            Stop: 11,
            Cheer: 12,
            Dock: 13,
            Gather: 14,
            Repair: 15,
            Scatter: 16,
            EnterTransport: 17,
            PlaceBomb: 18
        }
    }

    constructor(game, gameUtils) {
        this.game = game

        //qWe - 获取当前游戏的单位情况
        this.gameUtils = gameUtils

        this.initActionApi()
    }


    initActionApi() {
        const botManager = this.game.botManager

        this.playerActionApi = new ActionApi(botManager.actionFactory, botManager.actionQueue, this.getPlayerName(GameApi.GameApiEnum.PlayerType.Player), this.game)
        this.aiActionApi = new ActionApi(botManager.actionFactory, botManager.actionQueue, this.getPlayerName(GameApi.GameApiEnum.PlayerType.Ai), this.game)
    }

    generateUnitObject(player, unitName, unitType, count) {
        var o = () => {
            var self = this
            var t = this.game;
            // 玩家信息
            var n = player;
            // 玩家的开始坐标
            var a = t.map.startingLocations[n.startLocation]
            // 该玩家在本地图的坐标
            var l = t.map.tiles.getByMapCoords(a.x, a.y);

            // var r = [].concat(this.gameUtils.$V(this.rules.infantryRules.values()), this.gameUtils.$V(this.rules.vehicleRules.values()))

            // 获取这个国家可以制造的兵种
            // var o = this.gameUtils.GVe.StartingUnitsGenerator.generate(this.gameOpts.unitCount, this.gameUtils.$V(this.rules.vehicleRules.keys()), r, n.country);

            // 构建地图筛选器
            var p,
                d = [],
                y = false,
                m = new this.gameUtils._Ue.CardinalTileFinder(
                    t.map.tiles,
                    t.map.mapBounds,
                    l,
                    4,
                    4,
                    function (e) {
                        return !t.map.getGroundObjectsOnTile(e).find(function (e) {
                            return !(e.isSmudge() || (e.isOverlay() && e.isTiberium()));
                        }) && t.map.terrain.getPassableSpeed(e, self.gameUtils.zEe.SpeedType.Foot, false) > 0;
                    }
                ),
                v = new Map(),
                b = 0;


            // 测试召唤
            for (var index = 0; index < count; index++) {
                var s = unitName, u = unitType;

                // 查找可以用地图-开始
                var c, h;
                var T = void 0;
                if (y || ((T = m.getNextTile()) ? d.push(T) : y = !0), y && d.length) {
                    c = d[b];
                    var x = v.get(c);
                    x || (x = new this.gameUtils._Ue.CardinalTileFinder(t.map.tiles, t.map.mapBounds, c, 1, 0, function (e) {
                        return !t.map.getGroundObjectsOnTile(e).find(function (e) {
                            return !(e.isSmudge() || e.isOverlay() && e.isTiberium())
                        }) && 0 < t.map.terrain.getPassableSpeed(e, self.gameUtils.zEe.SpeedType.Foot, !1)
                    }), v.set(c, x)), b = (b + 1) % d.length, T = x.getNextTile()
                }
                // 查找可以用地图-结束

                if (T) {
                    if (h = t.rules.getObject(s, u), u === this.gameUtils.zxe.ObjectType.Vehicle) {
                        c = t.createUnitForPlayer(h, n);
                        t.applyInitialVeteran(c, n);
                        t.spawnObject(c, T);
                    } else {
                        if (u !== this.gameUtils.zxe.ObjectType.Infantry) {
                            throw new Error("Should not reach this line");
                        }
                        var E, O = this.gameUtils.JV(this.gameUtils.vLe.Infantry.SUB_CELLS.slice(0, 1));
                        try {
                            for (O.s(); !(E = O.n()).done;) {
                                var f = E.value;
                                var P = t.createUnitForPlayer(h, n);
                                P.position.subCell = f;
                                t.applyInitialVeteran(P, n);
                                t.spawnObject(P, T);
                            }
                        } catch (e) {
                            O.e(e);
                        } finally {
                            O.f();
                        }
                    }
                }
            }

        }

        o()
    }

    generateUnitObjectByEnum(playerType, unitName, unitType, count) {
        if (GameApi.GameApiEnum.PlayerType.Player === playerType) {
            this.generateUnitObject(this.getPlayer(GameApi.GameApiEnum.PlayerType.Player), unitName, unitType, count)
        } else {
            this.generateUnitObject(this.getPlayer(GameApi.GameApiEnum.PlayerType.Ai), unitName, unitType, count)
        }
    }

    getPlayerOfMap() {
        // todo:联机需要修改
        var playerList = this.game.playerList.getCombatants()
        return {
            player: playerList[0],
            ai: playerList[1]
        }
    }

    getPlayer(playerType) {
        var gamePlayerMap = this.getPlayerOfMap()

        if (GameApi.GameApiEnum.PlayerType.Player === playerType) {
            return gamePlayerMap.player
        } else {
            return gamePlayerMap.ai
        }
    }

    getPlayerName(playerType) {
        var gamePlayerMap = this.getPlayerOfMap()

        if (GameApi.GameApiEnum.PlayerType.Player === playerType) {
            return gamePlayerMap.player.name
        } else {
            return gamePlayerMap.ai.name
        }
    }

    /**
     * 基地车自动部署
     */
    gameBaseDeploySelected(playName) {
        var m = e.getVisibleUnits(this.name, "self", function (e) {
            return d.includes(e.name)
        });
        console.log(m)
    }

}