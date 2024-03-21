let handles = {}
let gameApi
runWsConnect(handles)

const getControls = async () => {
    let resp = await fetch("http://localhost:8080/controls")
    resp = await resp.json()
    return resp.res
}

const handleAction = (control, action, options) => {
    try {
        const {gameType} = action
        const {giftCount, user, gift} = options
        switch (gameType) {
            case 0:
                // 召唤的单位
                // console.log(action)
                const {parameter} = action
                const {count, ownerPlayer, unitType, unitCode, targetPlayer} = parameter
                if (gameApi) {
                    gameApi.generateUnitObjectByEnum(targetPlayer, ownerPlayer, unitCode, unitType, count * giftCount)
                    gameApi.sendSystemMessage(`${user.nickName} 赠送 ${gift.name} 触发 [${control.name} * ${giftCount}]`, GameApi.GameApiEnum.MessageType.Success, 10)
                    gameApi.forceAttackPlayer()
                }
                break;
        }
    } catch (e) {
        gameApi = null
    }
}

// 送礼物
handles.WebcastGiftMessage = async (msg) => {
    const giftName = msg.gift.name
    const giftCount = Number(msg.repeatCount)
    const user = msg.user

    // 找到配对的规则
    const controls = await getControls()
    const matchControls = controls.filter((item) => item.isGift && item.trigger.includes(giftName))

    console.log(msg.gift, giftCount)
    // 匹配到的游戏规则
    matchControls.forEach((control) => {
        // 匹配到规则的所有操作
        control.actions.forEach((action) => {
            handleAction(control, action, {gift: msg.gift, user: msg.user, giftCount})
        })
    })
}

const HookCore = function (api) {

    gameApi = new GameApi(this, api, {
        generateLimitCount: 2000
    })

    // 玩家自动部署基地车
    gameApi.baseDeploySelected(GameApi.GameApiEnum.PlayerType.Player)

    setTimeout(() => {
        gameApi.editGameCredits(GameApi.GameApiEnum.PlayerType.Player, 999999999)
        gameApi.editGameCredits(GameApi.GameApiEnum.PlayerType.Ai, 999999999)

        gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Ai,GameApi.GameApiEnum.PlayerType.Ai,"ZEP",GameApi.GameApiEnum.ObjectType.Vehicle, 520 * 3)
        gameApi.forceAttackPlayer()
    }, 3000)
}

const HookCoreEnd = function () {
    console.log("end")
}