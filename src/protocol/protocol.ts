import * as protobuf from 'protobufjs';

export namespace Protocol {
    /**
     * Load protocol from server-generated .json file
     * @type {Root}
     */
    export let ProtobufRoot = protobuf.Root.fromJSON(require('./protocol.json'));

    /**
     * Server-copy of EntityType enumerator
     */
    export enum EntityType {
        Spectator = 0,
        Player = 1,
        WoodGenerator = 2,
        StoneGenerator = 3,
        Pig = 4,
        Wolf = 5,
        Chicken = 6,
        Bear = 7,
        RideablePig = 8,
        RideableWolf = 9,
        WoodBlock = 10,
        StoneBlock = 11,
        Door = 12,
        FoodCrate = 13,
        WoodCrate = 14,
        StoneCrate = 15,
        Tower = 16,
        Mannequin = 17,
        Heartstone = 18,
        Garden = 19,
        PigSpawner = 20,
        ChickenSpawner = 21,
        WolfSpawner = 22,
        BearSpawner = 23,
        EggPickup = 24,
        PigMeatPickup = 25,
        BearMeatPickup = 26,
        CarrotPickup = 27,
        BoxPickup = 28,
        FollowerBot = 29,
        GuardBot = 30,
        FarmerBot = 31,
        GardenBot = 32,
        WhiteBear = 33,
        WinterWoodGenerator = 34,
        WinterStoneGenerator = 35,
        WhiteBearSpawner = 36,
        SoccerBall = 37,
        FireballBullet = 38,
        NightmareBoss = 39,
        WhiteWalker = 40,
        WhiteWalkerSpawner = 41,
        WinterWall = 42,
        WinterFloor = 43,
        WinterTower = 44,
        WhiteBearHat = 45,
        BrownBearHat = 46,
        ChessHat = 47,
        CowboyHat = 48,
        HiddenHat = 49,
        CatHat = 50,
        CoinPickup = 51,
        ChickenHat = 52,
    }

    /**
     * Server-copy of HatType enumerator
     */
    export enum HatType {
        WhiteBearHat = 0,
        BrownBearHat = 1,
        ChessHat = 2,
        CowboyHat = 3,
        HiddenHat = 4,
        CatHat = 5,
        ChickenHat = 6,
    }

    /**
     * Server-copy of BuildingType enumerator
     */
    export enum BuildingType {
        WoodBlock = 0,
        StoneBlock = 1,
        Door = 2,
        FarmerBot = 3,
        GuardBot = 4,
        FollowerBot = 5,
        Garden = 6,
        Heartstone = 7,
        Tower = 8,
        FoodCrate = 9,
        WoodCrate = 10,
        StoneCrate = 11,
        Mannequin = 12,
        RideableWolf = 13,
        GardenBot = 14,
        SoccerBall = 15,
    }

    export function BuildingTypeToEntityType(buildingType: BuildingType): EntityType {
        return EntityType[BuildingType[buildingType]];
    }

    export function EntityTypeToBuildingType(entityType: EntityType): BuildingType {
        return BuildingType[EntityType[entityType]];
    }

    /**
     * Server-copy of ResourceType enumerator
     */
    export enum ResourceType {
        Food = 0,
        Wood = 1,
        Stone = 2,
        Gold = 3,
    }

    export function ParseResourceType(s: string): ResourceType {
        let l = s.toLowerCase();
        if (l === "food") {
            return ResourceType.Food;
        } else if (l === "wood") {
            return ResourceType.Wood;
        } else if (l === "stone") {
            return ResourceType.Stone;
        } else if (l === "gold") {
            return ResourceType.Gold;
        }
        return ResourceType.Food;
    }

    /**
     * Server-copy of messageType enumerator
     */
    export enum MessageType {
        SyncObject = 0,
        SyncObjectDelete = 1,
        PlayerSpawnRequest = 2,
        PlayerInput = 3,
        PlayerAction = 4,
        PlayerBuildRequest = 5,
        PlayerBuildResponse = 6,
        PlayerChatRequest = 7,
        ObjectSendDamage = 8,
        ObjectReceiveDamage = 9,
        SyncBackpack = 10,
        Ping = 11,
        RequestServerInfo = 12,
        ResponseServerInfo = 13,
        Assign = 14,
        FloatResources = 15,
        SyncChild = 16,
        SyncChildDelete = 17,
        MapMessage = 18,
        LeaderboardMessage = 19,
        ChatMessage = 20,
        PlayerUnmountRequest = 21,
        PlayerCheat = 22,
        ForceDisconnect = 23,
        PlayerSetViewportSize = 24,
        PackedMessage = 25,
        LeaderboardMessagePlayer = 26,
        PlayerCreateTeam = 27,
        PlayerJoinTeam = 28,
        PlayerApproveRequest = 29,
        PlayerDeclineRequest = 30,
        PlayerLeaveTeam = 31,
        PlayerKickRequest = 32,
        PlayerTeamMembersRequest = 33,
        PlayerTeamMembersResponse = 34,
        PlayerTeamListRequest = 35,
        PlayerTeamListResponse = 36,
        NotifyTeamCreated = 37,
        NotifyTeamRemoved = 38,
        NotifyJoinRequestCreated = 39,
        NotifyJoinRequestRemoved = 40,
        NotifyMemberJoin = 41,
        NotifyMemberLeave = 42,
        DayTimeMessage = 43,
    }

    /**
     * Network message holder, contains type and decoded protobuf message
     */
    export class Message {
        public type: MessageType;
        public content: protobuf.Message;

        constructor (type: MessageType, content: protobuf.Message) {
            this.type = type;
            this.content = content;
        }
    }

    let _protobufDecodeCache = {};
    /**
     * Decode network message using protobuf
     * @param data
     * @returns {Message}
     */
    export function decode(data: Uint8Array): Message {
        if (data.length > 0) {
            let messageId = data[0];
            let messageType = MessageType[messageId];
            if (messageType != null) {
                let messageBuffer: Uint8Array = data.slice(1, data.length);
                let messageClass: protobuf.Type;
                if (_protobufDecodeCache.hasOwnProperty(messageType)) {
                    messageClass = _protobufDecodeCache[messageType];
                } else {
                    messageClass = ProtobufRoot.lookupType(messageType);
                    _protobufDecodeCache[messageType] = messageClass;
                }
                if (messageClass != null) {
                    return new Message(messageId, messageClass.decode(messageBuffer));
                }
            }
        }
        return null;
    }

    /**
     * Encode message into uint8array using protobuf
     * @param type - type of message (first byte)
     * @param data - content of message, should have same struct as protobuf message
     * @returns {Uint8Array}
     */
    export function encode(type: MessageType, data: Object): Uint8Array {
        let messageType = MessageType[type];
        let messageClass: protobuf.Type = ProtobufRoot.lookupType(messageType);
        let encoded: Uint8Array = messageClass.encode(data).finish();
        let output = new Uint8Array(encoded.length + 1);
        output[0] = type;
        output.set(encoded, 1);
        return output;
    }
}

