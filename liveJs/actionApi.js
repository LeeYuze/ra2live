class ActionApi {

    static ActionApiEnum = {
        ActionType: {
            NoAction: 0,
            QuitGame: 1,
            ObserveGame: 2,
            PlaceBuilding: 3,
            SellBuilding: 4,
            ToggleRepair: 5,
            SelectUnits: 6,
            OrderUnits: 7,
            UpdateQueue: 8,
            ToggleAlliance: 9,
            ActivateSuperWeapon: 10,
            PingLocation: 11
        }
    }

    constructor(actionFactory, actionQueue, playerName, game) {
        this.actionFactory = actionFactory;
        this.actionQueue = actionQueue;
        this.playerName = playerName;
        this.game = game;

    }

    placeBuilding(name, x, y) {
        this.createAction(ActionApi.ActionApiEnum.ActionType.PlaceBuilding, action => {
            action.name = name;
            action.tile = {x, y};
        });
    }

    sellBuilding(buildingId) {
        this.createAction(ActionApi.ActionApiEnum.ActionType.SellBuilding, action => {
            action.buildingId = buildingId;
        });
    }

    toggleRepairWrench(buildingId) {
        this.createAction(ActionApi.ActionApiEnum.ActionType.ToggleRepair, action => {
            action.buildingId = buildingId;
        });
    }

    toggleAlliance(toPlayerName, toggle) {
        this.createAction(ActionApi.ActionApiEnum.ActionType.ToggleAlliance, action => {
            action.toPlayerName = toPlayerName;
            action.toggle = toggle;
        });
    }

    pauseProduction(queueType) {
        this.createAction(ActionApi.ActionApiEnum.ActionType.UpdateQueue, action => {
            action.queueType = queueType;
            action.updateType = PWe.UpdateType.Pause;
        });
    }

    resumeProduction(queueType) {
        this.createAction(ActionApi.ActionApiEnum.ActionType.UpdateQueue, action => {
            action.queueType = queueType;
            action.updateType = PWe.UpdateType.Resume;
        });
    }

    queueForProduction(queueType, objectId, objectType, quantity) {
        const item = this.game.rules.getObject(objectId, objectType);
        this.createAction(ActionApi.ActionApiEnum.ActionType.UpdateQueue, action => {
            action.queueType = queueType;
            action.updateType = PWe.UpdateType.Add;
            action.item = item;
            action.quantity = quantity;
        });
    }

    unqueueFromProduction(queueType, objectId, objectType, quantity) {
        const item = this.game.rules.getObject(objectId, objectType);
        this.createAction(ActionApi.ActionApiEnum.ActionType.UpdateQueue, action => {
            action.queueType = queueType;
            action.updateType = PWe.UpdateType.Cancel;
            action.item = item;
            action.quantity = quantity;
        });
    }

    activateSuperWeapon(superWeaponType, tile, tile2) {
        this.createAction(ActionApi.ActionApiEnum.ActionType.ActivateSuperWeapon, action => {
            action.superWeaponType = superWeaponType;
            action.tile = {x: tile.rx, y: tile.ry};
            action.tile2 = tile2 ? {x: tile2.rx, y: tile2.ry} : undefined;
        });
    }

    orderUnits(unitIds, orderType, x, y, queue = true) {
        let target;
        this.createAction(ActionApi.ActionApiEnum.ActionType.SelectUnits, action => {
            action.unitIds = unitIds;
        });
        if (x) {
            let targetTile;
            if (y) {
                let bridgeTile;
                const mapTile = this.game.map.tiles.getByMapCoords(x, y);
                if (!mapTile) throw new Error(`No tile found at rx,ry=${x},${y}`);
                targetTile = mapTile;
                if (queue) bridgeTile = this.game.map.tileOccupation.getBridgeOnTile(mapTile);
            } else {
                targetTile = this.game.getObjectById(x).tile;
            }
            target = this.game.createTarget(targetTile, bridgeTile);
        }
        this.createAction(ActionApi.ActionApiEnum.ActionType.OrderUnits, action => {
            action.orderType = orderType;
            action.target = target;
            action.queue = queue;
        });
    }

    quitGame() {
        this.createAction(ActionApi.ActionApiEnum.ActionType.QuitGame);
    }

    createAction(actionType, callback) {
        const action = this.actionFactory.create(actionType);
        action.playerName = this.playerName;
        if (callback) {
            callback(action);
        }
        this.actionQueue.push(action);
    }
}