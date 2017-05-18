import ServerManager from '../servermanager';
import Socket from '../socket/socket';
import {Protocol} from "../protocol/protocol";
import MessageType = Protocol.MessageType;

/**
 * Connection state, try to connect and move on to "game" state
 */
export default class Connection extends Phaser.State {

    private socket: Socket;
    private isServerFullDisconnect: boolean = false;


    public onDisconnected() {
        if (!this.isServerFullDisconnect) {
            this.game.state.start('crash', true, true);
        }
    }

    public onServerFullDisconnect() {
        this.isServerFullDisconnect = true;
        this.game.state.start('full', true, true);
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