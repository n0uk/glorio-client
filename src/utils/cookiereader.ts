export default class CookieReader {
    static read(name: string): string {
        let nameEQ = name + '=';
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }
    
    static write(name: string, value: string): void {
        let date = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
        // let data = [encodeURIComponent(name) + '=' + encodeURIComponent(value), 'domain=.glor.io', 'path=/'];
        let data = [encodeURIComponent(name) + '=' + encodeURIComponent(value), `domain=.${window.location.hostname}`, 'path=/', 'expires=' + date.toUTCString()];
        document.cookie = data.join('; ');
    }
}