/**
 * Simple ajax helper class
 */
export default class Ajax {
    /**
     * Make AJAX request by url, paste *JSON* encoded data into callback on success
     * @param url
     * @param callback should have signature callback(jsonParsedResponse)
     */
    static call(url, callback) {
        let xmlhttp: XMLHttpRequest;
        // compatible with IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                callback(JSON.parse(xmlhttp.responseText));
            }
        };
        xmlhttp.open('GET', url, true);
        xmlhttp.send();
    }
}