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

        try {
            var s = unitName, u = unitType;
            for (var S = count; 0 < S;) {
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
                if (T) if (h = t.rules.getObject(s, u), u === self.gameUtils.zxe.ObjectType.Vehicle) c = t.createUnitForPlayer(h, ownerPlayer), t.applyInitialVeteran(c, n), t.spawnObject(c, T), S--; else {
                    if (u !== self.gameUtils.zxe.ObjectType.Infantry) throw new Error("Should not reach this line");
                    var E, O = self.gameUtils.JV(self.gameUtils.vLe.Infantry.SUB_CELLS.slice(0, S));
                    try {
                        for (O.s(); !(E = O.n()).done;) {
                            f = E.value;
                            var P = t.createUnitForPlayer(h, ownerPlayer);
                            P.position.subCell = f, t.applyInitialVeteran(P, n), t.spawnObject(P, T), S--
                        }
                    } catch (e) {
                        O.e(e)
                    } finally {
                        O.f()
                    }
                } else S--
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
    forceAttackBot() {
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

        var actionApi = GameApi.GameApiEnum.PlayerType.Player === sellBuildType ? this.playerActionApi : this.aiActionApi

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