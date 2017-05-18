interface Window { adplayer: any; }

declare let DEBUG: boolean;
declare let DEFAULT_GAME_WIDTH: number;
declare let DEFAULT_GAME_HEIGHT: number;
declare let MAX_GAME_WIDTH: number;
declare let MAX_GAME_HEIGHT: number;
declare let SCALE_MODE: string;
declare let GOOGLE_WEB_FONTS: string[];
declare let SOUND_EXTENSIONS_PREFERENCE: string[];
declare let Config; 
declare let SOCKETIO_URL: string;
declare let Protocol;

declare module "*.json" {
    const value: any;
    export default value;
}

declare interface Map<T> {
    [K: string]: T;
}

declare interface IntMap<T> {
    [K: number]: T;
}