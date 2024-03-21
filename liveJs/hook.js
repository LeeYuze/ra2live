let handles = {}
let gameApi
runWsConnect(handles)

const getControls = async () => {
    let resp = await fetch("http://localhost:8080/controls")
    resp = await resp.json()
    return resp.res
}

const handleSendSystemMessage = (control, action, options) => {
    const {gameType, parameter} = action
    const {user, gift} = options
    const {
        targetPlayer
    } = parameter
    const {isGift, isLike} = control
    const giftCount = options.giftCount ? options.giftCount : 1
    const giftMsg = {
        success: () => {
            gameApi.sendSystemMessage(`${user.nickName} 赠送 [${gift.name}] 触发 [${control.name}] x ${giftCount}`, GameApi.GameApiEnum.MessageType.Success, 10)
        },
        danger: () => {
            gameApi.sendSystemMessage(`${user.nickName} 赠送 [${gift.name}] 触发 [${control.name}] x ${giftCount}`, GameApi.GameApiEnum.MessageType.Danger, 10)
        }
    }
    if (isGift && [0, 2].includes(gameType)) {
        if (isGift && targetPlayer === GameApi.GameApiEnum.PlayerType.Player) {
            giftMsg.success()
        } else {
            giftMsg.danger()
        }
    }
    if (isGift && [1, 3].includes(gameType)) {
        if (isGift && targetPlayer === GameApi.GameApiEnum.PlayerType.Player) {
            giftMsg.danger()
        } else {
            giftMsg.success()
        }
    }

    // 评论时触发
    if (!isGift && !isLike) {
        gameApi.sendSystemMessage(`${user.nickName} 评论 [${options.content}] 触发 [${control.name}]`, GameApi.GameApiEnum.MessageType.Info, 10)
    }
}

const handleAction = (control, action, options) => {
    try {
        const {gameType, parameter} = action
        const {isGift} = control
        const {
            limitCount,
            count,
            ownerPlayer,
            unitType,
            unitCode,
            targetPlayer,
            superWeaponType,
            unitLevelType,
            sellBuildType
        } = parameter
        const giftCount = options.giftCount ? options.giftCount : 1
        switch (gameType) {
            case 0:
                // 召唤的单位
                if (gameApi) {
                    gameApi.generateUnitObjectByEnum(targetPlayer, ownerPlayer, unitCode, unitType, Math.min(isGift ? count * giftCount : count, limitCount))
                    gameApi.forceAttackPlayer()
                }
                break;
            case 1:
                if (gameApi) {
                    gameApi.activateSuperWeaponToUnitsByPlayer(targetPlayer, superWeaponType, isGift ? count * giftCount : count)
                    gameApi.forceAttackPlayer()
                }
                break;
            case 2:
                if (gameApi) {
                    for (let i = 0; i < giftCount; i++) {
                        gameApi.editPlayerAllUnitsVeteran(targetPlayer, unitLevelType)
                        gameApi.forceAttackPlayer()
                    }
                }
                break;
            case 3:
                if (gameApi) {
                    for (let i = 0; i < giftCount; i++) {
                        gameApi.sellBuild(targetPlayer, sellBuildType)
                        gameApi.forceAttackPlayer()
                    }
                }
                break;
            case 4:
                if (gameApi) {
                    gameApi.forceAttackPlayer()
                }
                break;
        }
        handleSendSystemMessage(control, action, options)
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

    // 匹配到的游戏规则
    matchControls.forEach((control) => {
        // 匹配到规则的所有操作
        control.actions.forEach((action) => {
            handleAction(control, action, {gift: msg.gift, user, giftCount})
        })
    })
}

// 弹幕
handles.WebcastChatMessage = async (msg) => {
    const {content} = msg

    // 找到配对的规则
    const controls = await getControls()
    const matchControls = controls.filter((item) => !item.isGift && item.trigger.find(t => content.indexOf(t) > -1))

    // 匹配到的游戏规则
    matchControls.forEach((control) => {
        // 匹配到规则的所有操作
        control.actions.forEach((action) => {
            handleAction(control, action, {user: msg.user, content})
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

        // gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Player, GameApi.GameApiEnum.PlayerType.Player, "E1", GameApi.GameApiEnum.ObjectType.Infantry, 1024 * 4)
    }, 3000)
}

const HookCoreEnd = function () {
    console.log("end")
}