// ObjectType: {
//     None: 0,
//         Aircraft: 1,
//         Building: 2,
//         Infantry: 3,
//         Overlay: 4,
//         Smudge: 5,
//         Terrain: 6,
//         Vehicle: 7,
//         Animation: 8,
//         Projectile: 9,
//         VoxelAnim: 10,
//         Debris: 11
// }


const HookCore = function (api) {
    console.log("hook core")
    console.log(this)

    var e;

    var o = () => {
        var t = this;
        // 玩家信息
        var n = e;
        // console.log(n)
        // 玩家的开始坐标
        var a = this.map.startingLocations[n.startLocation]
        // 该玩家在本地图的坐标
        var l = this.map.tiles.getByMapCoords(a.x, a.y);

        // var r = [].concat(api.$V(this.rules.infantryRules.values()), api.$V(this.rules.vehicleRules.values()))

        // 获取这个国家可以制造的兵种
        // var o = api.GVe.StartingUnitsGenerator.generate(this.gameOpts.unitCount, api.$V(this.rules.vehicleRules.keys()), r, n.country);


        // 构建地图筛选器
        var p,
            d = [],
            y = false,
            m = new api._Ue.CardinalTileFinder(
                this.map.tiles,
                this.map.mapBounds,
                l,
                4,
                4,
                function (e) {
                    return !t.map.getGroundObjectsOnTile(e).find(function (e) {
                        return !(e.isSmudge() || (e.isOverlay() && e.isTiberium()));
                    }) && t.map.terrain.getPassableSpeed(e, api.zEe.SpeedType.Foot, false) > 0;
                }
            ),
            v = new Map(),
            b = 0;


        // 测试召唤
        for(var index = 0; index < 100; index++) {
            var s = "JUMPJET", u = api.zxe.ObjectType.Infantry;

            // 查找可以用地图-开始
            var c,h;
            var T = void 0;
            if (y || ((T = m.getNextTile()) ? d.push(T) : y = !0), y && d.length) {
                c = d[b];
                var x = v.get(c);
                x || (x = new api._Ue.CardinalTileFinder(t.map.tiles, t.map.mapBounds, c, 1, 0, function (e) {
                    return !t.map.getGroundObjectsOnTile(e).find(function (e) {
                        return !(e.isSmudge() || e.isOverlay() && e.isTiberium())
                    }) && 0 < t.map.terrain.getPassableSpeed(e, api.zEe.SpeedType.Foot, !1)
                }), v.set(c, x)), b = (b + 1) % d.length, T = x.getNextTile()
            }
            // 查找可以用地图-结束

            if (T) {
                if (h = t.rules.getObject(s, u), u === api.zxe.ObjectType.Vehicle) {
                    c = t.createUnitForPlayer(h, n);
                    t.applyInitialVeteran(c, n);
                    t.spawnObject(c, T);
                } else {
                    if (u !== api.zxe.ObjectType.Infantry) {
                        throw new Error("Should not reach this line");
                    }
                    var E, O = api.JV(api.vLe.Infantry.SUB_CELLS.slice(0, 1));
                    try {
                        for (O.s(); !(E = O.n()).done;) {
                            f = E.value;
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


    var playerList = this.playerList.getCombatants()
    var player = playerList[0]
    var ai = playerList[0]

    e = player
    o.apply(this)
}