var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var notifications;
        (function (notifications) {
            var NotificationsCtrl = /** @class */ (function () {
                function NotificationsCtrl(datacontext, args) {
                    var _this = this;
                    this.datacontext = datacontext;
                    this.notifications = ko.observableArray();
                    this.panelVisibility = ko.observable(false);
                    this.growlNotificationsOn = ko.observable(true);
                    this.subscriptions = [];
                    this.ordering = args.ordering;
                    var gntcHandler = sffw.extractEventHandlerFromApiArgs(datacontext, args, 'OnGrowlNotificationsToggle');
                    if (gntcHandler) {
                        this.onGrowlNotificationsToggleHandler = gntcHandler;
                    }
                    var pvcHandler = sffw.extractEventHandlerFromApiArgs(datacontext, args, 'OnPanelVisibilityChanged');
                    if (pvcHandler) {
                        this.onPanelVisibilityChangedHandler = pvcHandler;
                    }
                    var ncHandler = sffw.extractEventHandlerFromApiArgs(datacontext, args, 'OnNotificationsChanged');
                    if (ncHandler) {
                        this.onNotificationsChangedHandler = ncHandler;
                    }
                    this.subscriptions.push(this.panelVisibility.subscribe(function (newValue) {
                        if (_this.onPanelVisibilityChangedHandler) {
                            _this.onPanelVisibilityChangedHandler(_this, null, { isVisible: newValue });
                        }
                    }));
                    this.subscriptions.push(this.notifications.subscribe(function () {
                        if (_this.onNotificationsChangedHandler) {
                            _this.onNotificationsChangedHandler(_this, null, { notificationCount: _this.notifications().length });
                        }
                    }, this, 'arrayChange'));
                }
                NotificationsCtrl.prototype.addItem = function (type, message) {
                    var newItem = { type: type, message: message };
                    if (this.ordering === 'FirstTop') {
                        this.notifications.push(newItem);
                    }
                    else {
                        this.notifications.unshift(newItem);
                    }
                    sffw.safeWriteToAriaLiveRegion(message);
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
                        if (this.onGrowlNotificationsToggleHandler) {
                            this.onGrowlNotificationsToggleHandler(this, null, { isOn: args.isOn });
                        }
                    }
                };
                NotificationsCtrl.prototype.setPanelVisibility = function (args) {
                    if (typeof args.isVisible !== 'undefined' && args.isVisible !== null) {
                        this.panelVisibility(args.isVisible);
                    }
                };
                NotificationsCtrl.prototype.dispose = function () {
                    this.notifications = null;
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
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
var sffw;
(function (sffw) {
    function safeWriteToAriaLiveRegion(message) {
        if (message && window.sf.accessibility && window.sf.accessibility.ariaLiveRegion) {
            window.sf.accessibility.ariaLiveRegion.append(message);
        }
    }
    sffw.safeWriteToAriaLiveRegion = safeWriteToAriaLiveRegion;
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function extractEventHandlerFromApiArgs(datacontext, args, eventName) {
        if (args.$events && args.$events[eventName] && args.$events[eventName].Reference) {
            if (args.$events[eventName].ReferenceType === 'Global') {
                return datacontext.$globals.$actions[args.$events[eventName].Reference];
            }
            else {
                return datacontext.$actions[args.$events[eventName].Reference];
            }
        }
        return undefined;
    }
    sffw.extractEventHandlerFromApiArgs = extractEventHandlerFromApiArgs;
})(sffw || (sffw = {}));
