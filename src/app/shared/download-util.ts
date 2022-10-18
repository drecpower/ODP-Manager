export class downloadUtil {
    public static initiateDownloadDataFromBrowser(content, filename, contentType=null) {
        if (!contentType) contentType = 'application/octet-stream';
        var a = document.createElement('a');
        var blob = new Blob([content], { 'type': contentType });
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }

    public static initiateDownloadTextFromBrowser(content, filename) {
        var contentType = 'application/text';
        var a = document.createElement('a');
        var blob = new Blob([content], { 'type': contentType });
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }

}