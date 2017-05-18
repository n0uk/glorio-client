import {UrlParse} from './utils/urlparse';
import Ajax from "./utils/ajax";

/**
 * Handle server addresses
 */
export default class ServerManager {

    private static IP: string = '127.0.0.1';
    private static PORT: string = '8080';

    public static init(callback: Function) {
        if (DEBUG) {
            callback();
        } else {
            Ajax.call('/ip', function (obj) {
                ServerManager.IP = obj.ip;
                ServerManager.PORT = obj.port;
                callback();
            });
        }
    }

    public static getHostAddress(): string {
        if (DEBUG) {
            return 'ws://localhost:8080/';
        } else {
            let party_url: string = UrlParse.getUrlParameterByName('ip');
            if (party_url) {
                return `ws://${party_url}`;
            } else {
                return `ws://${ServerManager.IP}:${ServerManager.PORT}`;
            }
        }
    }

    public static getHostAddressRaw(): string {
        if (DEBUG) {
            return 'localhost:8080';
        } else {
            let party_url: string = UrlParse.getUrlParameterByName('ip');
            if (party_url) {
                return `${party_url}`;
            } else {
                return `${ServerManager.IP}:${ServerManager.PORT}`;
            }
        }
    }
}