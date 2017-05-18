export namespace UrlParse {
    export function getUrlParameterByName(name: string): string {
        let url: string = window.location.href;
        let data: string = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + data + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}