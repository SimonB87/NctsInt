var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var notifications;
        (function (notifications) {
            var GrowlNotification = /** @class */ (function () {
                function GrowlNotification(notification, iconClasses) {
                    this.type = notification.type;
                    this.message = notification.message;
                    switch (this.type) {
                        case "info":
                            this.role = "status";
                            this.growlClass = "notification-info";
                            this.iconClass = iconClasses.iconClassInfo;
                            break;
                        case "success":
                            this.role = "status";
                            this.growlClass = "notification-success";
                            this.iconClass = iconClasses.iconClassSuccess;
                            break;
                        case "warning":
                            this.role = "status";
                            this.growlClass = "notification-warning";
                            this.iconClass = iconClasses.iconClassWarning;
                            break;
                        case "error":
                            this.role = "alert";
                            this.growlClass = "notification-error";
                            this.iconClass = iconClasses.iconClassError;
                            break;
                    }
                    this.iconClassClose = iconClasses.iconClassClose;
                }
                return GrowlNotification;
            }());
            notifications.GrowlNotification = GrowlNotification;
        })(notifications = components.notifications || (components.notifications = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var notifications;
        (function (notifications) {
            var GrowlNotificationModel = /** @class */ (function () {
                function GrowlNotificationModel(params, componentInfo) {
                    var _this = this;
                    this.notifications = ko.observableArray();
                    this.growls = ko.observableArray();
                    this.subscriptions = [];
                    if (params.controller) {
                        this.controller = params.controller;
                        this.notifications = this.controller.notifications;
                        this.growlNotificationsOn = params.controller.growlNotificationsOn;
                    }
                    else {
                        console.error('Controller param not provided to GrowlNotification');
                    }
                    this.displayTime = params.displayTime || 4000;
                    this.isSupressed = ko.pureComputed(this.getIsSupressed, this);
                    this.iconClasses = {
                        iconClassInfo: params.iconClassInfo || 'icon icon-tulli-info',
                        iconClassSuccess: params.iconClassSuccess || 'icon icon-tulli-checkmark',
                        iconClassWarning: params.iconClassWarning || 'icon icon-tulli-attention',
                        iconClassError: params.iconClassError || 'icon icon-tulli-attention',
                        iconClassClose: params.iconClassClose || 'icon icon-tulli-close',
                    };
                    var self = this;
                    self.closeNotification = function (item, event) {
                        clearTimeout(item.timerId);
                        self.growls.remove(item);
                    };
                    this.subscriptions.push(this.notifications.subscribe(function (changes) {
                        if (ko.unwrap(_this.isSupressed) !== true) {
                            changes.forEach(function (change) {
                                if (change.status === 'added') {
                                    var newGrowl = new notifications.GrowlNotification(change.value, _this.iconClasses);
                                    if (_this.growls().length > 0) {
                                        _this.growls().forEach(function (item) {
                                            clearTimeout(item.timerId);
                                        });
                                        _this.growls().forEach(function (growl, index, arr) {
                                            // if multiple growls are active at one time
                                            // we must multiply displayTime interval for all items below topmost
                                            var multiplier = arr.length - index + 1;
                                            _this.startGrowlDisplayInterval(growl, _this.displayTime * multiplier);
                                        });
                                    }
                                    _this.growls.push(newGrowl);
                                    _this.startGrowlDisplayInterval(newGrowl, _this.displayTime);
                                }
                            });
                        }
                    }, null, "arrayChange"));
                }
                GrowlNotificationModel.prototype.startGrowlDisplayInterval = function (growl, interval) {
                    var _this = this;
                    var tId = setTimeout(function (item) {
                        _this.growls.remove(item);
                    }, interval, growl);
                    growl.timerId = tId;
                };
                GrowlNotificationModel.prototype.getIsSupressed = function () {
                    return !ko.unwrap(this.growlNotificationsOn());
                };
                GrowlNotificationModel.prototype.dispose = function () {
                    _.each(this.subscriptions, function (sub) {
                        sub.dispose();
                    });
                    this.notifications = null;
                    this.controller = null;
                };
                return GrowlNotificationModel;
            }());
            notifications.GrowlNotificationModel = GrowlNotificationModel;
        })(notifications = components.notifications || (components.notifications = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var notifications;
        (function (notifications) {
            var NotificationPanelModel = /** @class */ (function () {
                function NotificationPanelModel(params, componentInfo) {
                    this.notifications = ko.observableArray();
                    if (params.controller) {
                        this.controller = params.controller;
                        this.notifications = this.controller.notifications;
                        this.isVisible = this.controller.panelVisibility;
                        this.growlNotificationsOn = this.controller.growlNotificationsOn;
                    }
                    else {
                        console.error('Controller param not provided to NotificationPanel');
                    }
                    this.iconClasses = {
                        iconClassInfo: params.iconClassInfo || 'icon icon-tulli-info',
                        iconClassSuccess: params.iconClassSuccess || 'icon icon-tulli-checkmark',
                        iconClassWarning: params.iconClassWarning || 'icon icon-tulli-attention',
                        iconClassError: params.iconClassError || 'icon icon-tulli-attention',
                        iconClassClose: params.iconClassClose || 'icon icon-tulli-close',
                    };
                    this.iconClassClear = params.iconClassClear || 'fa fa-bell-slash-o';
                    this.iconClassDisplayGrowlNotifications = params.iconClassDisplayGrowlNotifications || 'icon icon-tulli-eye';
                    this.cssDisplayGrowlNotifications = ko.pureComputed(this.getCssDisplayGrowlNotifications, this);
                    var self = this;
                    self.closeNotification = function (item, event) {
                        self.notifications.remove(item);
                    };
                }
                NotificationPanelModel.prototype.getCssDisplayGrowlNotifications = function () {
                    return this.iconClassDisplayGrowlNotifications + (ko.unwrap(this.growlNotificationsOn) ? " turned-on" : "");
                };
                NotificationPanelModel.prototype.getNotificationClass = function (item) {
                    switch (item.type) {
                        case "info":
                            return "notification-info";
                        case "success":
                            return "notification-success";
                        case "warning":
                            return "notification-warning";
                        case "error":
                            return "notification-error";
                    }
                };
                NotificationPanelModel.prototype.getIconClass = function (item) {
                    switch (item.type) {
                        case "info":
                            return this.iconClasses.iconClassInfo;
                        case "success":
                            return this.iconClasses.iconClassSuccess;
                        case "warning":
                            return this.iconClasses.iconClassWarning;
                        case "error":
                            return this.iconClasses.iconClassError;
                    }
                };
                NotificationPanelModel.prototype.clearAll = function () {
                    this.notifications.removeAll();
                };
                NotificationPanelModel.prototype.toggleGrowlNotifications = function () {
                    this.controller.setGrowlNotificationsOn({ isOn: !this.growlNotificationsOn() });
                };
                return NotificationPanelModel;
            }());
            notifications.NotificationPanelModel = NotificationPanelModel;
        })(notifications = components.notifications || (components.notifications = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var notifications;
        (function (notifications) {
            var NotificationPanelStatusIconModel = /** @class */ (function () {
                function NotificationPanelStatusIconModel(params, componentInfo) {
                    this.notifications = ko.observableArray();
                    if (params.controller) {
                        this.controller = params.controller;
                        this.notifications = this.controller.notifications;
                    }
                    else {
                        console.error('Controller param not provided to NotificationPanelStatusIcon');
                    }
                    this.iconClass = params.iconClass || 'fa fa-bell';
                    this.count = ko.pureComputed(this.getCount, this);
                    this.isExpanded = this.controller.panelVisibility;
                }
                NotificationPanelStatusIconModel.prototype.getCount = function () {
                    return this.controller.getCount();
                };
                NotificationPanelStatusIconModel.prototype.togglePanel = function () {
                    this.controller.panelVisibility(!this.controller.panelVisibility());
                };
                return NotificationPanelStatusIconModel;
            }());
            notifications.NotificationPanelStatusIconModel = NotificationPanelStatusIconModel;
        })(notifications = components.notifications || (components.notifications = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var notifications;
        (function (notifications) {
            if (ko && !ko.components.isRegistered('sffw-growl-notification')) {
                ko.components.register('sffw-growl-notification', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.notifications.GrowlNotificationModel(params, componentInfo); }
                    },
                    template: "\n<div>\n    <!-- ko foreach: growls -->\n        <div class=\"notification growl alert-dismissable notification-position-absolute\" data-bind=\"css: growlClass\">\n            <div class=\"row\">\n                <div class=\"growl-icon\">\n                    <span data-bind=\"css: iconClass\"></span>\n                </div>\n                <div class=\"growl-message\" data-bind=\"attr: { role: role }\">\n                    <span><p data-bind=\"text: message\"/></span>\n                </div>\n                <div class=\"growl-button\">\n                    <button data-bind=\"click: $parent.closeNotification, attr: {'aria-label': $root.$localize('Notifications$$close')}\" class=\"growl-button-close\">\n                        <span data-bind=\"css: iconClassClose\" aria-hidden=\"true\"/>\n                    </button>\n                </div>\n            </div>\n        </div>\n    <!-- /ko -->\n</div>\n"
                });
            }
        })(notifications = components.notifications || (components.notifications = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var notifications;
        (function (notifications) {
            if (ko && !ko.components.isRegistered('sffw-notification-panel-status-icon')) {
                ko.components.register('sffw-notification-panel-status-icon', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.notifications.NotificationPanelStatusIconModel(params, componentInfo); }
                    },
                    template: "\n<div class=\"notifications-status-icon\">\n    <button class=\"notification-trigger\" data-bind=\"click: togglePanel\n        , attr: {'aria-label': $root.$localize('Notifications$$togglePanel') + '. ' + $root.$localize('Notifications$$numberOfNotifications') + ': ' + count() , 'aria-expanded': isExpanded() ? 'true' : 'false'}\">\n        <i data-bind=\"css: iconClass\" aria-hidden=\"true\"></i>\n        <span class=\"notification-num\" data-bind=\"text: count, attr: { 'data-notifications-count': count }\" aria-hidden=\"true\"></span>\n    </a>\n</div>\n"
                });
            }
        })(notifications = components.notifications || (components.notifications = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var notifications;
        (function (notifications) {
            if (ko && !ko.components.isRegistered('sffw-notification-panel')) {
                ko.components.register('sffw-notification-panel', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.notifications.NotificationPanelModel(params, componentInfo); }
                    },
                    template: "\n<div class=\"notification-panel\" data-bind=\"visible: isVisible\">\n    <div class=\"notification-panel-header\">\n        <button class=\"notification-panel-header-button\" data-bind=\"click: clearAll,\n            attr: {'title': $root.$localize('Notifications$$clearAll'), 'aria-label': $root.$localize('Notifications$$clearAll')}\">\n            <i data-bind=\"css: iconClassClear\" aria-hidden=\"true\"></i>\n        </button>\n        <button class=\"notification-panel-header-button button-toggle-growls\" data-bind=\"click: toggleGrowlNotifications,\n            attr: {'title': ko.unwrap(growlNotificationsOn) == true ? $root.$localize('Notifications$$turnGrowlsOff') : $root.$localize('Notifications$$turnGrowlsOn'),\n            'aria-label': ko.unwrap(growlNotificationsOn) == true ? $root.$localize('Notifications$$turnGrowlsOff') : $root.$localize('Notifications$$turnGrowlsOn')}\">\n            <i data-bind=\"css: cssDisplayGrowlNotifications\" aria-hidden=\"true\"></i>\n        </button>\n    </div>\n    <ul class=\"notifications\">\n        <!-- ko foreach: { data: notifications, as: 'notification' } -->\n            <li class=\"notification alert-dismissable\" data-bind=\"css: $parent.getNotificationClass(notification)\">\n                <div class=\"row\">\n                    <div class=\"notification-icon\">\n                        <span data-bind=\"css: $parent.getIconClass(notification)\"></span>\n                    </div>\n                    <div class=\"notification-message\">\n                        <span><p data-bind=\"text: message\"/></span>\n                    </div>\n                    <div class=\"notification-button\">\n                        <button data-bind=\"click: $parent.closeNotification, attr: {'aria-label': $root.$localize('Notifications$$close')}\" class=\"notification-button-close\">\n                            <span data-bind=\"css: $parent.iconClasses.iconClassClose\" aria-hidden=\"true\"/>\n                        </button>\n                    </div>\n                </div>\n            </li>\n        <!-- /ko -->\n    </ul>\n</div>\n"
                });
            }
        })(notifications = components.notifications || (components.notifications = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
