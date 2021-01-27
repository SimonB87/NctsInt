var sffw;
(function (sffw) {
    var api;
    (function (api) {
        var browserStorage;
        (function (browserStorage) {
            var BrowserStorage = /** @class */ (function () {
                function BrowserStorage(datacontext, args) {
                    if (window) {
                        this.storage = args.sessionOnly ? window.sessionStorage : window.localStorage;
                    }
                }
                BrowserStorage.prototype.getItem = function (args) {
                    if (this.storage) {
                        return this.storage.getItem(args.key);
                    }
                    return null;
                };
                // returns false if method was not successful either because storage is not available or quota was exceeded
                BrowserStorage.prototype.setItem = function (args) {
                    if (this.storage) {
                        try {
                            this.storage.setItem(args.key, args.value);
                        }
                        catch (err) {
                            // quota was possibly exceeded; do nothing
                        }
                    }
                };
                BrowserStorage.prototype.removeItem = function (args) {
                    if (this.storage) {
                        this.storage.removeItem(args.key);
                    }
                };
                BrowserStorage.prototype.clear = function () {
                    if (this.storage) {
                        this.storage.clear();
                    }
                };
                return BrowserStorage;
            }());
            browserStorage.BrowserStorage = BrowserStorage;
        })(browserStorage = api.browserStorage || (api.browserStorage = {}));
    })(api = sffw.api || (sffw.api = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.api.browserStorage.BrowserStorage;
    });
}
