const HookCore = function (api) {
    console.log("hook core")
    console.log(this)
    console.log(api)

    const gameApi = new GameApi(this, api)

    // 玩家自动部署基地车
    gameApi.baseDeploySelected(GameApi.GameApiEnum.PlayerType.Player)


    // 部署成功后才可以执行召唤
    setInterval(() => {
        // // 向玩家发射核弹
        // gameApi.activateSuperWeaponToUnitsByPlayer(GameApi.GameApiEnum.PlayerType.Player, GameApi.GameApiEnum.SuperWeaponType.LightningStorm)

        // // 给AI生成
        // gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Ai, "APOC", GameApi.GameApiEnum.ObjectType.Vehicle, 1, function () {
        //     // AI强制攻击
        //     gameApi.forceAttackBot()
        // })
        // gameApi.sendSystemMessage("你好你好你好你好哦", "#e6de0d", 1)
    }, 2000)


    // gameApi.editPlayerAllUnitsVeteran(GameApi.GameApiEnum.PlayerType.Player,GameApi.GameApiEnum.VeteranLevel.Elite)
    // gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Player, "ZEP", GameApi.GameApiEnum.ObjectType.Aircraft, 1)
    //
    setTimeout(() => {
        // gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Player, "APOC", GameApi.GameApiEnum.ObjectType.Vehicle, 188)
        // gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Player, "ZEP", GameApi.GameApiEnum.ObjectType.Vehicle, 1)
        // gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Player, "ZEP", GameApi.GameApiEnum.ObjectType.Vehicle, 5)
        // gameApi.editPlayerAllUnitsVeteran(GameApi.GameApiEnum.PlayerType.Player,GameApi.GameApiEnum.VeteranLevel.Elite)
        // gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Player, "ZEP", GameApi.GameApiEnum.ObjectType.Vehicle, 5)

        // gameApi.activateSuperWeaponToUnitsByPlayer(GameApi.GameApiEnum.PlayerType.Player, GameApi.GameApiEnum.SuperWeaponType.LightningStorm)
    }, 5000)


    setTimeout(() => {
        gameApi.editGameCredits(GameApi.GameApiEnum.PlayerType.Player, 999999999)
        gameApi.editGameCredits(GameApi.GameApiEnum.PlayerType.Ai, 999999999)
    }, 3000)
}