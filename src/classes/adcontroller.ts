import CookieReader from '../utils/cookiereader';

export default class AdController {
    
    static increase_start_count() {
        AdController.set_start_count(AdController.get_start_count() + 1);
    }
    
    static get_start_count() {
        return parseInt(CookieReader.read('ad_start')) || 1;
    }
    
    static set_start_count(value) {
        CookieReader.write('ad_start', value);
    }
    
    static increase_end_count() {
        AdController.set_end_count(AdController.get_end_count() + 1);
    }
    
    static get_end_count() {
        return parseInt(CookieReader.read('ad_end')) || 1;
    }
    
    static set_end_count(value) {
        CookieReader.write('ad_end', value);
    }
    
    static drop_counts() {
        AdController.set_start_count(1);
        AdController.set_end_count(1);
    }
    
    static check_integrity() {
        if (AdController.get_start_count() > AdController.get_end_count()) {
            return false;
        } else {
            return true;
        }
    }
    
    static is_need_play_ad() {
        if (DEBUG) {
            return false;
        } else {
            // If user press F5 while playing ads
            if (!AdController.check_integrity()) {
                AdController.drop_counts();
                AdController.set_start_count(2);
                AdController.set_end_count(2);
                return true;
            }

            let ad_start = AdController.get_start_count();
            // Every second play (default: 1)
            if (ad_start === 2) {
                return true;
            }

            // Every 5 play, after 2
            if ((ad_start - 2) % 5 === 0) {
                return true;
            }

            return false;
        }
    }
    
    static play(callback) {
        if (window.adplayer && AdController.is_need_play_ad()) {
            // console.log('Attempt to playing ad at play: ' + AdController.get_start_count());
            window.adplayer.onadcompleted = function () {
                AdController.increase_end_count();
                callback();
            };
            AdController.increase_start_count();
            window.adplayer.startPreRoll();
            // Debug MODE
            // window.adplayer.onadcompleted();
        } else {
            // console.log('Ignore playing add at play: ' + AdController.get_start_count());
            AdController.increase_start_count();
            AdController.increase_end_count();
            callback();
        }
    }
}