var ws;
var url = 'ws://localhost:8181';

function connect() {
    ws = new WebSocket(url);

    ws.onopen = function() {
        console.log('WebSocket Connected');
        // 启动心跳包定时器，每秒发送一次心跳包
        startHeartbeat();
    };

    ws.onclose = function() {
        console.log('WebSocket Closed');
        // 停止心跳包定时器
        clearInterval(heartbeatInterval);
        // 断线后重新连接
        setTimeout(function() {
            connect();
        }, 1000); // 重连间隔，单位：毫秒
    };

    ws.onerror = function(error) {
        console.error('WebSocket Error:', error);
        // 出错后也尝试重新连接
        ws.close();
    };
}

// 心跳包定时器
let heartbeatInterval;

// 启动心跳包定时器函数
function startHeartbeat() {
    heartbeatInterval = setInterval(function() {
        // 每秒向服务器发送一次心跳包
        sendHeartbeat();
    }, 1000); // 每秒发送一次心跳包
}

// 向服务器发送心跳包函数
function sendHeartbeat() {
    // 如果 WebSocket 连接已建立，则发送心跳包
    if (ws.readyState === WebSocket.OPEN) {
        ws.send('heartbeat');
    }
}

connect()

const HookCore = function (api) {

    const gameApi = new GameApi(this, api, {
        generateLimitCount: 2000
    })

    gameApi.baseDeploySelected(GameApi.GameApiEnum.PlayerType.Player)


    ws.onmessage = function(event) {
        console.log('Received message:', event.data);

        // 解析收到的消息
        const message = JSON.parse(event.data);

        // 根据消息内容调用相应的 GameApi 方法
        switch (message.action) {
            case 'generateUnit':
                gameApi.generateUnitObjectByEnum(message.playerType, message.unitName, message.unitType, message.count);
                break;
            // 可以添加其他指令的处理逻辑...
            default:
                console.error('Invalid action:', message.action);
        }
    };

    // 玩家自动部署基地车



    //
    //
    // // // 部署成功后才可以执行召唤
    // // setInterval(() => {
    // //     // // 向玩家发射核弹
    // //     // gameApi.activateSuperWeaponToUnitsByPlayer(GameApi.GameApiEnum.PlayerType.Player, GameApi.GameApiEnum.SuperWeaponType.LightningStorm)
    // //
    // //     // // 给AI生成
    // //     // gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Ai, "APOC", GameApi.GameApiEnum.ObjectType.Vehicle, 1, function () {
    // //     //     // AI强制攻击
    // //     //     gameApi.forceAttackBot()
    // //     // })
    // //     // gameApi.sendSystemMessage("你好你好你好你好哦", "#e6de0d", 1)
    // // }, 2000)
    //
    //
    // // gameApi.editPlayerAllUnitsVeteran(GameApi.GameApiEnum.PlayerType.Player,GameApi.GameApiEnum.VeteranLevel.Elite)
    // // gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Player, "ZEP", GameApi.GameApiEnum.ObjectType.Aircraft, 1)
    // //
    // setTimeout(() => {
    //     gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Player, "APOC", GameApi.GameApiEnum.ObjectType.Vehicle, 3000)
    //     // gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Player, "ZEP", GameApi.GameApiEnum.ObjectType.Vehicle, 1)
    //     // gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Player, "ZEP", GameApi.GameApiEnum.ObjectType.Vehicle, 5)
    //     // gameApi.editPlayerAllUnitsVeteran(GameApi.GameApiEnum.PlayerType.Player,GameApi.GameApiEnum.VeteranLevel.Elite)
    //     // gameApi.generateUnitObjectByEnum(GameApi.GameApiEnum.PlayerType.Player, "ZEP", GameApi.GameApiEnum.ObjectType.Vehicle, 5)
    //
    //     // gameApi.activateSuperWeaponToUnitsByPlayer(GameApi.GameApiEnum.PlayerType.Player, GameApi.GameApiEnum.SuperWeaponType.LightningStorm)
    //     // gameApi.sellBuild(GameApi.GameApiEnum.PlayerType.Ai, GameApi.GameApiEnum.sellBuildType.Random)
    // }, 3000)
    //
    // //
    // setTimeout(() => {
    //     gameApi.editGameCredits(GameApi.GameApiEnum.PlayerType.Player, 999999999)
    //     gameApi.editGameCredits(GameApi.GameApiEnum.PlayerType.Ai, 999999999)
    // }, 3000)
}