class Utils {
    static getRandomByArray(array) {
        // 随机生成一个索引，范围是数组的长度减一
        const randomIndex = Math.floor(Math.random() * array.length);
        // 返回对应索引的数组元素
        return array[randomIndex];
    }

    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

/**
 * gameHlper
 *
 * isPlayerDefeated
 * areAlliedPlayers
 * canPlaceBuilding
 * getAdjacencyMap
 * getBuildingRule
 * getBuildingPlacementData
 * getPlayers
 * getPlayerData
 * getAllTerrainObjects
 * getAllUnits
 * getVisibleUnits
 * getGameObjectData
 * getUnitData
 * getAllSuperWeaponData
 * getGeneralRules
 * getRulesIni
 * getArtIni
 * generateRandomInt
 * generateRandom
 * getTickRate
 * getCurrentTick
 */

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
        },
        // 超级武器类型映射
        SuperWeaponType: {
            MultiMissile: 0,
            IronCurtain: 1,
            LightningStorm: 2, // 闪电风暴
            ChronoSphere: 3,
            ChronoWarp: 4,
            ParaDrop: 5,
            AmerParaDrop: 6
        },
        BotStates: {
            Initial: 0,
            Deployed: 1,
            Attacking: 2,
            Defending: 3,
            Scouting: 4,
            Defeated: 5
        },
        VeteranLevel: {
            None: 0,
            Veteran: 1,
            Elite: 2
        },
        SellBuildType: {
            All: 0,
            Random: 1,
        },
        MessageType: {
            Success: "#67C23A",
            Warning: "#E6A23C",
            Danger: "#F56C6C",
            Info: "#909399"
        }
    }

    constructor(game, gameUtils, config) {
        this.game = game

        this.config = config

        //qWe - 获取当前游戏的单位情况
        this.gameUtils = gameUtils

        this.gameHelper = new this.gameUtils.qWe.GameApi(game, null)

        this.initActionApi()
        // this.initMessageApi()
        this.messageApi = this.gameUtils.hookMessageList
    }


    initActionApi() {
        const botManager = this.game.botManager

        this.playerActionApi = new ActionApi(botManager.actionFactory, botManager.actionQueue, this.getPlayerName(GameApi.GameApiEnum.PlayerType.Player), this.game)
        this.aiActionApi = new ActionApi(botManager.actionFactory, botManager.actionQueue, this.getPlayerName(GameApi.GameApiEnum.PlayerType.Ai), this.game)
    }

    generateUnitObject(player, ownerPlayer, unitName, unitType, count) {
        var teleport = function (self, e, r) {
            var i = r.obj, s = r.destTile, l;
            if (i.isSpawned) {
                var u, c = !1, f = s ? e.map.tileOccupation.getBridgeOnTile(s) : void 0,
                    h = e.map.getGroundObjectsOnTile(s), p = h.find(function (e) {
                        return e.isBuilding()
                    });
                var o = h.some(function (t) {
                        return e.rules.general.padAircraft.includes(t.name)
                    }),
                    a = e.rules.general.padAircraft.includes(i.name) && !(null == p || !p.helipadTrait) && !(null === (u = p.dockTrait) || void 0 === u || !u.getAllDockTiles().includes(s)) && p.owner === i.owner;
                var d = !1, y = i.rules.speedType;
                if (i.rules.movementZone === self.gameUtils.lOe.MovementZone.Fly && (y = self.gameUtils.zEe.SpeedType.Wheel), l = e.map.mapBounds.isWithinBounds(s), !(a || e.map.terrain.getPassableSpeed(s, y, !!f) && l)) {
                    var m = !1;
                    if (!o && (0 < e.map.terrain.getPassableSpeed(s, y, !!f, void 0, !0) || !l)) {
                        p && (c = !0);
                        var v = new self.gameUtils.qAe.RadialTileFinder(e.map.tiles, e.map.mapBounds, s, {
                            width: 1,
                            height: 1
                        }, 1, 15, function (t) {
                            return 0 < e.map.terrain.getPassableSpeed(t, y, !!t.onBridgeLandType) && !e.map.terrain.findObstacles({
                                tile: t,
                                onBridge: !!t.onBridgeLandType
                            }, i).length
                        });
                        (l = v.getNextTile()) && (s = l, f = e.map.tileOccupation.getBridgeOnTile(s), h = e.map.getGroundObjectsOnTile(s), m = !0)
                    }
                    m || (i.moveTrait.teleportUnitToTile(s, f, !0, !1, e), i.warpedOutTrait.setActive(!1, !0, e), e.map.getTileZone(s) === self.gameUtils.FAe.ZoneType.Water && (i.deathType = self.gameUtils.SRe.DeathType.Sink), e.destroyObject(i, {player: t.owner}), d = !0)
                }

                d || (i.moveTrait.teleportUnitToTile(s, f, !0, !1, e), a && null != p && p.dockTrait && (a = p.dockTrait.getAllDockTiles().indexOf(s), p.dockTrait.undockUnitAt(a), p.dockTrait.dockUnitAt(i, a)), c ? i.warpedOutTrait.setTimed(e.rules.general.chronoDelay, !1, e) : i.warpedOutTrait.setActive(!1, !0, e))
            }
        };

        var self = this
        var t = this.game;
        // 玩家信息
        var n = player;
        var a = t.map.startingLocations[n.startLocation]
        // 基地车NACNST GACNST
        const playerObjects = n.objectsById.values()
        Array.from(playerObjects).forEach(unit => {
            if (unit.name === 'NACNST' || unit.name === 'GACNST') {
                a = unit.position.tile
                a.x = a.rx
                a.y = a.ry
            }
        })

        var s = unitName, u = unitType;

        // 设置初始时间间隔和速度
        const initialInterval = 1000; // 初始时间间隔（毫秒）
        const speed = 300; // 速度（每秒生成的单位数）

        function spawnLoop(j) {
            // 获取对象
            var h = t.rules.getObject(s, u);

            // 创建单位并分配给指定玩家
            var i = t.createUnitForPlayer(h, ownerPlayer);

            // 生成对象到指定位置
            t.spawnObject(i, a);

            // 传送对象到目标位置
            teleport(self, t, {
                obj: i,
                destTile: a
            });

            // 如果未达到生成次数，则继续循环生成
            if (j < count - 1) {
                // 计算下一个生成的时间间隔（毫秒）
                const nextInterval = initialInterval / speed;

                // 延迟执行下一次生成
                setTimeout(function () {
                    spawnLoop(j + 1);
                }, nextInterval);
            }
        }

        spawnLoop(0);

    }

    async generateUnitObject2(player, ownerPlayer, unitName, unitType, count) {
        const wait = (ms) => {
            return new Promise(resolve => {
                setTimeout(resolve, ms);
            });
        }

        var self = this
        var t = this.game;
        // 玩家信息
        var n = player;
        var a = t.map.startingLocations[n.startLocation]
        // 基地车NACNST GACNST
        const playerObjects = n.objectsById.values()
        Array.from(playerObjects).forEach(unit => {
            if (unit.name === 'NACNST' || unit.name === 'GACNST') {
                a = unit.position.tile
                a.x = a.rx
                a.y = a.ry
            }
        })

        // 该玩家在本地图的坐标
        var l = t.map.tiles.getByMapCoords(a.x, a.y);
        // 创建单位生成器
        var c, h, f, p, d = [], y = !1,
            m = new self.gameUtils._Ue.CardinalTileFinder(t.map.tiles, t.map.mapBounds, l, 4, 4, function (e) {
                // 判断地块是否合适生成单位的条件
                return !t.map.getGroundObjectsOnTile(e).find(function (e) {
                    return !(e.isSmudge() || e.isOverlay() && e.isTiberium());
                }) && 0 < t.map.terrain.getPassableSpeed(e, self.gameUtils.zEe.SpeedType.Foot, !1);
            }),
            v = new Map, b = 0;

        // 设置生产速度限制
        var productionRateLimit = 2; // 设置为每帧生产一个单位

        try {
            var s = unitName, u = unitType;
            // 批量处理单位生成请求
            var batchCount = 10; // 设置每次处理的单位生成请求数量
            while (count > 0) {
                var batchCountActual = Math.min(count, batchCount); // 实际处理的单位生成请求数量

                for (let i = batchCountActual; i > 0; i--) {
                    // 生成单位
                    if (productionRateLimit > 0) {
                        // 生产速度限制处理
                        productionRateLimit--;
                        var T = void 0;
                        if (y || ((T = m.getNextTile()) ? d.push(T) : y = !0), y && d.length) {
                            c = d[b];
                            var x = v.get(c);
                            x || (x = new self.gameUtils._Ue.CardinalTileFinder(t.map.tiles, t.map.mapBounds, c, 1, 0, function (e) {
                                return !t.map.getGroundObjectsOnTile(e).find(function (e) {
                                    return !(e.isSmudge() || e.isOverlay() && e.isTiberium())
                                }) && 0 < t.map.terrain.getPassableSpeed(e, self.gameUtils.zEe.SpeedType.Foot, !1)
                            }), v.set(c, x)), b = (b + 1) % d.length, T = x.getNextTile()
                        }
                        if (T) {
                            if (h = t.rules.getObject(s, u), u === self.gameUtils.zxe.ObjectType.Vehicle) {
                                c = t.createUnitForPlayer(h, ownerPlayer);
                                t.applyInitialVeteran(c, n);
                                t.spawnObject(c, T);
                            } else {
                                if (u !== self.gameUtils.zxe.ObjectType.Infantry) {
                                    throw new Error("Should not reach this line");
                                }
                                var E, O = self.gameUtils.JV(self.gameUtils.vLe.Infantry.SUB_CELLS.slice(0, 1));
                                try {
                                    for (O.s(); !(E = O.n()).done;) {
                                        f = E.value;
                                        var P = t.createUnitForPlayer(h, ownerPlayer);
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
                        productionRateLimit++
                    }
                    await wait(1)
                }
                count -= batchCountActual; // 更新剩余的生成请求数量
            }
        } catch (e) {
            console.log(e)
        }

    }

    generateUnitObjectByEnum(playerType, ownerPlayer, unitName, unitType, count, cb) {
        count = count >= this.config.generateLimitCount ? this.config.generateLimitCount : count

        this.generateUnitObject(this.getPlayer(playerType), this.getPlayer(ownerPlayer), unitName, unitType, count)

        cb && cb()
    }

    getPlayerOfMap() {
        // todo:联机需要修改
        var playerList = this.game.playerList.getCombatants()
        return {
            player: playerList[0],
            ai: playerList[1]
        }
    }

    /**
     * 获取玩家信息
     * @param playerType
     * @returns {*}
     */
    getPlayer(playerType) {
        var gamePlayerMap = this.getPlayerOfMap()

        if (GameApi.GameApiEnum.PlayerType.Player === playerType) {
            return gamePlayerMap.player
        } else {
            return gamePlayerMap.ai
        }
    }

    /**
     * 获取玩家名称
     * @param playerType
     * @returns {*}
     */
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
    baseDeploySelected(playerType) {
        var playName = this.getPlayerName(playerType)
        var unitsIds = this.gameHelper.getVisibleUnits(playName, "self");
        unitsIds.length && this.playerActionApi.orderUnits([unitsIds[0]], GameApi.GameApiEnum.OrderType.DeploySelected);
    }

    /**
     * 发射超级武器
     */
    activateSuperWeaponToUnitsByPlayer(playerType, superWeaponType, count) {
        count = count || 1

        var player = this.getPlayer(playerType)
        var playerName = this.getPlayerName(playerType)

        for (let i = 0; i < count; i++) {
            var unitsIds = this.gameHelper.getVisibleUnits(playerName, "self");

            // 随机获取一个单位
            var unitId = Utils.getRandomByArray(unitsIds)
            var unitData = this.gameHelper.getUnitData(unitId)

            var unitDataTile = unitData.tile

            var superWeaponRules = {
                type: superWeaponType, // 假设要使用的是美国空投类型的超级武器
                weaponType: "NukeCarrier" // 核弹需要这个代码
            };

            // 发射
            this.game.traits.get(this.gameUtils.IIe.SuperWeaponsTrait).activateEffect(superWeaponRules, player, this.game, unitDataTile, null)
        }

    }

    /**
     * 修改游戏金额
     */
    editGameCredits(playerType, credits) {
        var player = this.getPlayer(playerType)
        player._credits = credits
    }

    /**
     * 修改ai状态
     */
    editBotState(stateType) {
        var bots = this.game.botManager.bots.values();
        var bot = Array.from(bots)[0];
        bot.botState = stateType;
    }

    /**
     * 机器人强制攻击
     */
    forceAttackPlayer() {
        var bots = this.game.botManager.bots.values();
        var bot = Array.from(bots)[0];
        bot.threatCache = 'attack'
        this.editBotState(GameApi.GameApiEnum.BotStates.Attacking)
    }

    /**
     * 修改该玩家所有单位的等级
     */
    editPlayerAllUnitsVeteran(playerType, levelType) {
        var player = this.getPlayer(playerType)
        var units = player.objectsById.values();
        Array.from(units).forEach(unit => {
            unit.veteranTrait && unit.veteranTrait.setVeteranLevel(levelType)
        })
    }

    sendSystemMessage(message, color, durationSeconds) {
        this.messageApi.addSystemMessage(message, color, durationSeconds)
    }


    sellBuild(playerType, sellBuildType) {
        var player = this.getPlayer(playerType)
        var buildings = Array.from(player.buildings.values())
        var actionApi = GameApi.GameApiEnum.PlayerType.Player === playerType ? this.playerActionApi : this.aiActionApi

        switch (sellBuildType) {
            case GameApi.GameApiEnum.SellBuildType.All:
                buildings.forEach(build => {
                    actionApi.sellBuilding(build.id)
                })
                break
            case GameApi.GameApiEnum.SellBuildType.Random:
                var build = Utils.getRandomByArray(buildings)
                actionApi.sellBuilding(build.id)
                break
        }
    }
}