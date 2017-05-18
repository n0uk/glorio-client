import {Protocol} from '../protocol/protocol';
import {EventEmitter} from 'events';
import MessageType = Protocol.MessageType;

/**
 * Socket wrapper class, providing possibility to emit
 * and receive protobuf messages
 */
export default class Socket extends EventEmitter {

    private websocket: WebSocket;

    constructor(url: string, connectionCallback: Function, disconnectionCallback: Function) {
        super();
        this.websocket = new WebSocket(url);

        this.websocket.binaryType = 'arraybuffer';

        this.websocket.onmessage = this.handleWebsocketMessage.bind(this);

        this.websocket.onopen = function () {
            connectionCallback();
        };

        this.websocket.onclose = function () {
            disconnectionCallback();
        };

        this.websocket.onerror = function () {
            disconnectionCallback();
        };

        window.onbeforeunload = function() {
            // Remove handler from onclose
            this.websocket.onclose = function () {};
            this.websocket.close();
        }.bind(this);

    }

    private handleWebsocketMessage(data: MessageEvent): void {
        let bytes = new Uint8Array(data.data);
        let message: Protocol.Message = Protocol.decode(bytes);
        if (message != null) {
            if (message.type === MessageType.PackedMessage) {
                // Here is a packed message, we need to split it up
                let messageBytes = message.content['message'];
                let offset: number = 0;
                for (let size of message.content['sizes']) {
                    let subBytes = new Uint8Array(messageBytes.buffer, offset + messageBytes.byteOffset, size);
                    let subMessage: Protocol.Message = Protocol.decode(subBytes);
                    if (subMessage != null) {
                        this.emit(subMessage.type.toString(), subMessage);
                    }
                    offset += size;
                }
            } else {
                this.emit(message.type.toString(), message);
            }
        }
    }

    public onMessage(messageType: Protocol.MessageType, callback: Function) {
        this.on(messageType.toString(), callback);
    }

    public sendMessage(messageType: Protocol.MessageType, messageContent: Object) {
        let buffer: Uint8Array = Protocol.encode(messageType, messageContent);
        this.websocket.send(buffer);
    }

    public destroy() {
        this.websocket.close();
    }
}