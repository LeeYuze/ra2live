





const HookCore = function (api) {
    console.log("hook core")
    console.log(this)
    console.log(api)

    const gameApi = new GameApi(this, api)

    // 玩家自动部署基地车
    gameApi.baseDeploySelected(GameApi.GameApiEnum.PlayerType.Player)



    // 部署成功后才可以执行召唤
    setInterval(()=>{
        // 向玩家发射核弹
        // gameApi.activateSuperWeaponToUnitsByPlayer(GameApi.GameApiEnum.PlayerType.Player, GameApi.GameApiEnum.SuperWeaponType.MultiMissile)

        // 给AI生成飞行兵
        gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Ai,"JUMPJET",GameApi.GameApiEnum.ObjectType.Infantry, 3)
        // AI强制攻击
        gameApi.forceAttackBot()
    },5000)



    setTimeout(()=>{
        gameApi.editGameCredits(GameApi.GameApiEnum.PlayerType.Player, 999999999)
        gameApi.editGameCredits(GameApi.GameApiEnum.PlayerType.Ai, 999999999)
    },3000)
}