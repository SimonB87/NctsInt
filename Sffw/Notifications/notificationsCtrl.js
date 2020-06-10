var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var notifications;
        (function (notifications) {
            var NotificationsCtrl = /** @class */ (function () {
                function NotificationsCtrl(datacontext, args) {
                    this.datacontext = datacontext;
                    this.notifications = ko.observableArray();
                    this.panelVisibility = ko.observable(false);
                    this.growlNotificationsOn = ko.observable(true);
                    this.ordering = args.ordering;
                }
                NotificationsCtrl.prototype.addItem = function (type, message) {
                    var newItem = { type: type, message: message };
                    if (this.ordering === 'FirstTop') {
                        this.notifications.push(newItem);
                    }
                    else {
                        this.notifications.unshift(newItem);
                    }
                };
                NotificationsCtrl.prototype.addInfo = function (args) {
                    this.addItem('info', args.message);
                };
                NotificationsCtrl.prototype.addSuccess = function (args) {
                    this.addItem('success', args.message);
                };
                NotificationsCtrl.prototype.addWarning = function (args) {
                    this.addItem('warning', args.message);
                };
                NotificationsCtrl.prototype.addError = function (args) {
                    this.addItem('error', args.message);
                };
                NotificationsCtrl.prototype.getCount = function () {
                    return this.notifications().length;
                };
                NotificationsCtrl.prototype.removeAll = function () {
                    this.notifications.removeAll();
                };
                NotificationsCtrl.prototype.setGrowlNotificationsOn = function (args) {
                    if (typeof args.isOn !== 'undefined' && args.isOn !== null) {
                        this.growlNotificationsOn(args.isOn);
                    }
                };
                NotificationsCtrl.prototype.dispose = function () {
                    this.notifications = null;
                };
                return NotificationsCtrl;
            }());
            notifications.NotificationsCtrl = NotificationsCtrl;
        })(notifications = components.notifications || (components.notifications = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
if (typeof define !== 'undefined') {
    define([], function () {
        return sffw.components.notifications.NotificationsCtrl;
    });
}
var sffw;
(function (sffw) {
    function assert(condition, message) {
        if (!condition) {
            if (message) {
                console.error('Assertion failed: ' + message);
            }
            else {
                console.error('Assertion failed');
            }
        }
    }
    sffw.assert = assert;
})(sffw || (sffw = {}));
