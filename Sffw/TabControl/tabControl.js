var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var tabControl;
        (function (tabControl) {
            if (ko && !ko.components.isRegistered('sffw-tabcontrol')) {
                ko.components.register('sffw-tabcontrol', {
                    viewModel: {
                        createViewModel: function (params, componentInfo) { return new sffw.components.tabControl.TabControlModel(params, componentInfo); }
                    },
                    template: "\n<div class=\"sffw-tabs\">\n    <!-- ko if: tabs -->\n        <ul data-bind=\"foreach: tabs\" role=\"tablist\">\n            <li role=\"presentation\" data-bind=\"css: cssClass, visible: isVisible\">\n                <a role=\"tab\" href=\"#\" data-bind=\"text: (isTitleLocalized() === true ? $root.$localize(title) : title),\n                    attr: { id: tabId, 'aria-selected': isSelected() ? 'true' : 'false', 'aria-controls': ariaControlsId },\n                    click: onTabClicked\"></a>\n            </li>\n        </ul>\n    <!-- /ko -->\n</div>\n"
                });
            }
        })(tabControl = components.tabControl || (components.tabControl = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var tabControl;
        (function (tabControl) {
            var TabControlClickParams = /** @class */ (function () {
                function TabControlClickParams(clickedTab) {
                    this.clickedTab = clickedTab;
                }
                return TabControlClickParams;
            }());
            tabControl.TabControlClickParams = TabControlClickParams;
            var TabControlModel = /** @class */ (function () {
                function TabControlModel(params, componentInfo) {
                    this.tabs = [];
                    this.selectedTab = params.SelectedTab;
                    this.tabClickHandler = params.OnTabClick;
                    this.createTabs(params.Tabs);
                }
                TabControlModel.prototype.createTabs = function (tabs) {
                    var _this = this;
                    var collectionOfTabs = typeof tabs === 'function' ? tabs() : tabs;
                    _(collectionOfTabs).each(function (t) {
                        var tab = new tabControl.TabModel(t, tabs.indexOf(t) + 1, _this);
                        _this.tabs.push(tab);
                    });
                };
                TabControlModel.prototype.setSelectedTab = function (tab, event) {
                    this.selectedTab(this.tabs.indexOf(tab) + 1);
                    if (this.tabClickHandler) {
                        var tabClickParams = new TabControlClickParams(this.selectedTab());
                        this.tabClickHandler(null, event ? event : null, tabClickParams);
                    }
                };
                TabControlModel.prototype.dispose = function () {
                    this.tabClickHandler = null;
                    _(this.tabs).each(function (tab) {
                        tab.dispose();
                    });
                    this.tabs = null;
                };
                return TabControlModel;
            }());
            tabControl.TabControlModel = TabControlModel;
        })(tabControl = components.tabControl || (components.tabControl = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    var components;
    (function (components) {
        var tabControl;
        (function (tabControl) {
            var TabModel = /** @class */ (function () {
                function TabModel(tabDef, index, parent) {
                    this.isTitleLocalized = ko.observable();
                    this.ariaControlsId = null;
                    this.tabIndex = index;
                    this.parentModel = parent;
                    this.title = tabDef.Title;
                    this.isVisible = typeof tabDef.Visible === 'undefined' ? true : tabDef.Visible;
                    this.customCssClass = typeof tabDef.CustomCssClass === 'undefined' ? '' : tabDef.CustomCssClass;
                    this.tabClickHandler = tabDef.OnTabClick;
                    this.isTitleLocalized(tabDef.IsTitleLocalized === true ? true : false);
                    this.cssClass = ko.pureComputed(this.getCssClass, this);
                    this.isSelected = ko.pureComputed(this.getIsSelected, this);
                    this.tabId = "tabcontrol-tab-id-" + sffw.generateRandomId();
                    if (tabDef.AriaControls && tabDef.AriaControls.length > 0) {
                        var componentDiv = $("div[data-name='" + tabDef.AriaControls + "']");
                        this.ariaControlsId = "tabcontrol-tabpanel-id-" + sffw.generateRandomId();
                        componentDiv.attr('role', 'tabpanel');
                        componentDiv.attr('id', this.ariaControlsId);
                        componentDiv.attr('aria-labelledby', this.tabId);
                    }
                }
                TabModel.prototype.onTabClicked = function (tab, event) {
                    if (this.parentModel) {
                        this.parentModel.setSelectedTab(this, event);
                        if (this.tabClickHandler) {
                            var tabClickParams = new tabControl.TabControlClickParams(this.tabIndex);
                            this.tabClickHandler(null, event ? event : null, tabClickParams);
                        }
                    }
                };
                TabModel.prototype.getIsSelected = function () {
                    return this.parentModel.selectedTab && this.parentModel.selectedTab() === this.tabIndex;
                };
                TabModel.prototype.getCssClass = function () {
                    var tabClass = 'sffw-tab';
                    if (typeof this.customCssClass === 'string' && this.customCssClass && this.customCssClass.length > 0) {
                        tabClass = tabClass + " " + this.customCssClass;
                    }
                    if (typeof this.customCssClass === 'function' && this.customCssClass() && this.customCssClass().length > 0) {
                        tabClass = tabClass + " " + this.customCssClass();
                    }
                    var cssClass = tabClass + (this.isSelected() ? ' sffw-tab-selected' : '');
                    return cssClass;
                };
                TabModel.prototype.dispose = function () {
                    this.parentModel = null;
                };
                return TabModel;
            }());
            tabControl.TabModel = TabModel;
        })(tabControl = components.tabControl || (components.tabControl = {}));
    })(components = sffw.components || (sffw.components = {}));
})(sffw || (sffw = {}));
var sffw;
(function (sffw) {
    function generateRandomId() {
        return "" + Date.now() + Math.random().toString(16).substr(2, 5).toUpperCase();
    }
    sffw.generateRandomId = generateRandomId;
})(sffw || (sffw = {}));
