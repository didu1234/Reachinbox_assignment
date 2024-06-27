const utils = {
    getParamsFromURL: function(url) {
        let params = {};
        let parser = new URL(url);
        let queryString = parser.hash.substring(1);
        let urlParams = new URLSearchParams(queryString);
        for (let [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        return params;
    },
    saveOAuth2Info: function(params, page, storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(params));
        localStorage.setItem('page', page);
    },
    logout: function(accessToken, redirectUrl) {
        let logoutWindow = window.open(`https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=${redirectUrl}`, '_blank');
        setTimeout(() => {
            logoutWindow.close();
            window.location.href = redirectUrl;
        }, 1000);
    }
};

export default utils;

