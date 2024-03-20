var ws;
var url = 'ws://localhost:8181';

function runWsConnect(handles) {
    ws = new WebSocket(url);

    ws.onopen = function () {
        console.log('WebSocket Connected');
        // 启动心跳包定时器，每秒发送一次心跳包
        startHeartbeat();
    };

    ws.onclose = function () {
        console.log('WebSocket Closed');
        // 停止心跳包定时器
        clearInterval(heartbeatInterval);
        // 断线后重新连接
        setTimeout(function () {
            runWsConnect(handles);
        }, 1000); // 重连间隔，单位：毫秒
    };

    ws.onerror = function (error) {
        console.error('WebSocket Error:', error);
        // 出错后也尝试重新连接
        ws.close();
    };

    ws.onmessage = function (message) {
        const data = message.data;
        const res = JSON.parse(data)
        const msg = res.message
        switch (msg.common.method) {
            case "WebcastMemberMessage":
                // 进入直播间
                if (handles["WebcastMemberMessage"]) {
                    handles["WebcastMemberMessage"](msg)
                }
                break
            case "WebcastGiftMessage":
                // 礼物
                if (handles["WebcastGiftMessage"]) {
                    handles["WebcastGiftMessage"](msg)
                }
                break
            case "WebcastChatMessage":
                // 弹幕
                if (handles["WebcastChatMessage"]) {
                    handles["WebcastChatMessage"](msg)
                }
                break
            case "WebcastLikeMessage":
                // 点赞
                if (handles["WebcastLikeMessage"]) {
                    handles["WebcastLikeMessage"](msg)
                }
                break
            case "WebcastSocialMessage":
                // 关注
                if (handles["WebcastSocialMessage"]) {
                    handles["WebcastSocialMessage"](msg)
                }
                break
        }
    }

    return ws;
}

// 心跳包定时器
let heartbeatInterval;

// 启动心跳包定时器函数
function startHeartbeat() {
    heartbeatInterval = setInterval(function () {
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
