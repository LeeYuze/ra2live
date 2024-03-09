





const HookCore = function (api) {
    console.log("hook core")
    console.log(this)
    console.log(api)

    const gameApi = new GameApi(this, api)

    //
    // //
    setTimeout(()=>{
        // generateUnitObjectByPlayType(dict.playerType.AI, "APOC", dict.ObjectType.Vehicle, 100)
        gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Player, "JUMPJET", GameApi.GameApiEnum.ObjectType.Infantry, 200)
    },0)

    // 玩家自动部署基地车

}