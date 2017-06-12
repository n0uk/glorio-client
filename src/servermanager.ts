import {UrlParse} from './utils/urlparse';
import Ajax from "./utils/ajax";

/**
 * Handle server addresses
 */
export default class ServerManager {

    private static IP: string = '127.0.0.1';
    private static PORT: string = '5000';

    public static init(callback: Function) {
        // Here we need to ping every region server
        if (DEBUG) {
            callback();
        } else {
            Ajax.call('/ip', function (obj) {
                ServerManager.IP = obj.ip;
                ServerManager.PORT = obj.port;
                callback();
            });
        }
        /*
        ServerManager.getNearestServer().then(val => {
            ServerManager.IP = val as string;
            ServerManager.PORT = '5000';
            callback();
        }).catch(() => {
            ServerManager.IP = '45.77.57.202';
            ServerManager.PORT = '5000';
            callback();
        });*/
    }

    public static getHostAddress(): string {
        if (DEBUG) {
            return 'ws://localhost:5000/';
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
            return 'localhost:5000';
        } else {
            let party_url: string = UrlParse.getUrlParameterByName('ip');
            if (party_url) {
                return `${party_url}`;
            } else {
                return `${ServerManager.IP}:${ServerManager.PORT}`;
            }
        }
    }

    private static getNearestServer(): Promise<string> {
        return new Promise(function (resolve, reject) {
            $.ajax('http://status.glor.io').done(function (data) {
                // Parse all servers to obj[region] = [server,server]
                let cities = {};
                for (let record of data) {
                    if (record.status) {
                        let city = record.name.split('-')[0];
                        city = city.charAt(0).toUpperCase() + city.slice(1);
                        if (!cities.hasOwnProperty(city)) {
                            cities[city] = [];
                        }
                        cities[city].push(record.host);
                    }
                }
                // Ping city servers
                let promises = [];
                for (let city of Object.keys(cities)) {
                    if (cities[city].length > 0) {
                        let promise = ServerManager.ping(`http://${cities[city][0]}/ip`, city, 0.3);
                        promises.push(promise);
                    }
                }

                ServerManager.successRace(promises).then(val => {
                    console.log(`Nearest server in ${val['city']} with ping ${val['delta']}ms`);
                    let servers = cities[val['city']];
                    let address = servers[Math.floor(Math.random() * servers.length)];
                    resolve(address);
                }).catch(err => {
                    // error
                    reject("All promises unresolved");
                });
            }).fail(function () {
                reject("Can't connect to status.glor.io");
            });
        });
    }

    private static successRace(promises) {
        return Promise.all(promises.map(p => {
            return p.then(
                val => Promise.reject(val),
                err => Promise.resolve(err)
            );
        })).then(
            errors => Promise.reject(errors),
            val => Promise.resolve(val)
        );
    }

    private static request_image(url) {
        return new Promise(function(resolve, reject) {
            let img = new Image();
            img.onload = function() { resolve(img); };
            img.onerror = function() { reject(url); };
            img.src = url + '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
        });
    }

    public static ping(url, city, multiplier) {
        return new Promise(function(resolve, reject) {
            let start = (new Date()).getTime();
            let response = function() {
                let delta = ((new Date()).getTime() - start);
                delta *= (multiplier || 1);
                resolve({city: city, delta: delta});
            };
            ServerManager.request_image(url).then(response).catch(response);

            // Set a timeout for max-pings, 3s.
            setTimeout(function() { reject(Error('Timeout')); }, 3000);
        });
    }
}