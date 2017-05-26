import ServerManager from '../servermanager';
import Socket from '../socket/socket';
import {Protocol} from "../protocol/protocol";
import MessageType = Protocol.MessageType;
import Message = Protocol.Message;

/**
 * Connection state, try to connect and move on to "game" state
 */
export default class Connection extends Phaser.State {

    private socket: Socket;
    private disconnectReason: number = -1;


    public onDisconnected() {
        if (this.disconnectReason < 0) {
            this.game.state.start('crash', true, true);
        }
    }

    public onServerFullDisconnect(msg: Message) {
        this.disconnectReason = msg.content['reason'];
        if (this.disconnectReason === 0) {
            this.game.state.start('full', true, true);
        } else {
            this.game.state.start('kicked', true, true);
        }
    }


    public onConnected() {
        // Hide preloader screen
        (<HTMLElement>document.getElementById('preloader-screen')).style.display = 'none';
        this.game.state.start('game', true, false, this.socket);
    }

    public preload(): void {
        ServerManager.init(function () {
            let host: string = ServerManager.getHostAddress();
            this.socket = new Socket(host, this.onConnected.bind(this), this.onDisconnected.bind(this));
            this.socket.onMessage(MessageType.ForceDisconnect, this.onServerFullDisconnect.bind(this));
            console.log(`Connecting to: ${host}`);
        }.bind(this));
    }

    public create(): void {
    }
    
    public shutdown() {
    }
}